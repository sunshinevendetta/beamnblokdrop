// SPDX-License-Identifier: MIT
/*
 * Copyright (c) 2025 BEAMN
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 * of the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
 * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
 * PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE
 * FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
 * ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 *
 * Created by Sunshine Vendetta
 */
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/cryptography/EIP712.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract BeamnScore is EIP712, ReentrancyGuard, Ownable {
    using ECDSA for bytes32;

    struct Leader {
        address player;
        uint256 score;
        uint256 timestamp;
    }

    bytes32 public immutable gameId;
    address public vault;
    uint256 public immutable submissionDeadline;
    address public authorizedSigner;

    uint256 public constant FEE = 0.25 ether;
    uint256 public totalFeesCollected;

    bool public paused;

    struct Score { uint256 value; uint256 timestamp; }
    mapping(address => Score) public playerScores;
    mapping(address => uint256) public playerNonces;
    mapping(address => bytes32) public playerData;
    address[] public players;

    Leader[5] public topLeaders;

    uint256 public constant MAX_TRACKED_PLAYERS = 10000000;

    bytes32 private constant SCORE_TYPEHASH =
        keccak256("Score(address player,uint256 score,uint256 nonce)");

    event Initialized(
        bytes32 gameId,
        address vault,
        uint256 submissionDeadline,
        address authorizedSigner
    );
    event VaultUpdated(address indexed oldVault, address indexed newVault);
    event SignerChanged(address indexed oldSigner, address indexed newSigner);
    event Paused(address indexed admin);
    event Unpaused(address indexed admin);
    event PlayerDataUpdated(address indexed player, bytes32 data);
    event SubmissionDetails(
        address indexed player,
        uint256 score,
        uint256 nonce,
        uint256 fee,
        uint256 timestamp,
        uint256 previousBest,
        uint256 highestSoFar
    );
    event NewTopScore(address indexed player, uint256 score, uint256 position);
    event EmergencyWithdraw(uint256 amount);
    event FeesTransferredToVault(uint256 amount);

    constructor(
        string memory _gameId,
        address _vault,
        uint256 _submissionDeadline,
        address _authorizedSigner,
        address initialOwner
    ) EIP712("BeamnScore", "1") {
        transferOwnership(initialOwner);
        require(_vault != address(0), "Invalid vault address");
        require(_authorizedSigner != address(0), "Invalid signer address");

        gameId = keccak256(abi.encodePacked(_gameId));
        vault = _vault;
        submissionDeadline = _submissionDeadline;
        authorizedSigner = _authorizedSigner;
        paused = false;

        emit Initialized(gameId, _vault, _submissionDeadline, _authorizedSigner);
    }

    receive() external payable {}
    fallback() external payable {}

    modifier whenNotPaused() {
        require(!paused, "Contract paused");
        _;
    }

    function setVault(address _newVault) external onlyOwner {
        require(_newVault != address(0), "Invalid vault address");
        address old = vault;
        vault = _newVault;
        emit VaultUpdated(old, _newVault);
    }

    function setAuthorizedSigner(address _newSigner) external onlyOwner {
        require(_newSigner != address(0), "Invalid signer address");
        address old = authorizedSigner;
        authorizedSigner = _newSigner;
        emit SignerChanged(old, _newSigner);
    }

    function pause() external onlyOwner {
        paused = true;
        emit Paused(msg.sender);
    }

    function unpause() external onlyOwner {
        paused = false;
        emit Unpaused(msg.sender);
    }

    function setPlayerData(bytes32 _data) external {
        playerData[msg.sender] = _data;
        emit PlayerDataUpdated(msg.sender, _data);
    }

    function submitScore(
        uint256 _score,
        bytes calldata _signature
    ) external payable nonReentrant whenNotPaused {
        require(msg.value == FEE, "Invalid fee amount");
        require(block.timestamp <= submissionDeadline, "Submission period ended");
        require(_score > 0, "Score must be greater than 0");

        uint256 nonce = playerNonces[msg.sender];

        bytes32 structHash = keccak256(abi.encode(
            SCORE_TYPEHASH,
            msg.sender,
            _score,
            nonce
        ));
        bytes32 digest = _hashTypedDataV4(structHash);
        require(ECDSA.recover(digest, _signature) == authorizedSigner, "Invalid signature");

        playerNonces[msg.sender] = nonce + 1;

        Score storage s = playerScores[msg.sender];
        uint256 prevBest = s.value;

        if (prevBest == 0 && s.timestamp == 0) {
            require(players.length < MAX_TRACKED_PLAYERS, "Player cap reached");
            players.push(msg.sender);
        }

        if (_score > prevBest) {
            s.value = _score;
            s.timestamp = block.timestamp;
            updateTopFive(msg.sender, _score, block.timestamp);
        }

        totalFeesCollected += msg.value;

        emit SubmissionDetails(
            msg.sender,
            _score,
            nonce + 1,
            msg.value,
            block.timestamp,
            prevBest,
            s.value
        );
    }

    function updateTopFive(address _player, uint256 _score, uint256 _timestamp) internal {
        bool inTop;
        uint256 pos;
        for (uint256 i = 0; i < 5; i++) {
            if (topLeaders[i].player == _player) {
                inTop = true;
                pos = i;
                break;
            }
        }
        if (inTop) {
            if (_score > topLeaders[pos].score) {
                topLeaders[pos].score = _score;
                topLeaders[pos].timestamp = _timestamp;
                sortTopLeaders();
            }
        } else if (_score > topLeaders[4].score || topLeaders[4].player == address(0)) {
            topLeaders[4] = Leader(_player, _score, _timestamp);
            sortTopLeaders();
        }
        for (uint256 i = 0; i < 5; i++) {
            if (topLeaders[i].player == _player) {
                emit NewTopScore(_player, _score, i + 1);
                break;
            }
        }
    }

    function sortTopLeaders() internal {
        for (uint256 i = 0; i < 5; i++) {
            for (uint256 j = i + 1; j < 5; j++) {
                if (topLeaders[j].score > topLeaders[i].score) {
                    Leader memory tmp = topLeaders[i];
                    topLeaders[i] = topLeaders[j];
                    topLeaders[j] = tmp;
                }
            }
        }
    }

    function transferFeesToVault() external onlyOwner nonReentrant {
        uint256 bal = address(this).balance;
        require(bal > 0, "No fees to transfer");
        (bool ok, ) = vault.call{value: bal}("");
        require(ok, "Transfer to vault failed");
        emit FeesTransferredToVault(bal);
    }

    function withdraw() external onlyOwner nonReentrant {
        uint256 bal = address(this).balance;
        require(bal > 0, "No funds available");
        (bool ok, ) = msg.sender.call{value: bal}("");
        require(ok, "Withdraw failed");
        emit EmergencyWithdraw(bal);
    }

    function getTop1() external view returns (Leader memory) {
        return topLeaders[0];
    }

    function getTop3() external view returns (Leader[3] memory) {
        return [topLeaders[0], topLeaders[1], topLeaders[2]];
    }

    function getTop5() external view returns (Leader[5] memory) {
        return topLeaders;
    }

    function getPlayerCount() external view returns (uint256) {
        return players.length;
    }
}