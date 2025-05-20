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

import "@openzeppelin/contracts/access/Ownable.sol";

contract SimpleBeamnScore is Ownable {
    struct Leader {
        address player;
        uint256 score;
        uint256 timestamp;
    }

    string public gameId;
    Leader[5] public topLeaders;
    mapping(address => uint256) public playerScores;
    address[] public players;

    event ScoreSubmitted(address indexed player, uint256 score, uint256 timestamp);
    event NewTopScore(address indexed player, uint256 score, uint256 position);

    constructor(string memory _gameId, address initialOwner) {
        gameId = _gameId;
        transferOwnership(initialOwner);
    }

    function submitScore(uint256 _score) external {
        require(_score > 0, "Score must be greater than 0");

        if (playerScores[msg.sender] == 0) {
            players.push(msg.sender);
        }

        if (_score > playerScores[msg.sender]) {
            playerScores[msg.sender] = _score;
            updateTopFive(msg.sender, _score, block.timestamp);
        }

        emit ScoreSubmitted(msg.sender, _score, block.timestamp);
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

    function getTop5() external view returns (Leader[5] memory) {
        return topLeaders;
    }

    function getPlayerCount() external view returns (uint256) {
        return players.length;
    }
}