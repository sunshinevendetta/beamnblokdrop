BEAMN Arcade Open-Source Prototype README
Overview
BEAMN Arcade is a decentralized gaming platform that blends mobile gaming with Web3 technologies, offering a transparent, rewarding, and socially engaging experience. This open-source prototype, designed for hackathon submission, showcases the core functionality of the platform through BlokDrop, a Tetris-inspired puzzle game. Players compete on a blockchain-based leaderboard, submit scores to earn soul-bound tokens (SBTs), and share achievements via a simulated social protocol. Built for Android and iOS devices, this prototype demonstrates the integration of gameplay, decentralized storage, smart contracts, and social features, while reserving proprietary elements for the full commercial release. A 0.25 GHO fee per score submission supports the ecosystem, with players eligible for weekly rewards based on leaderboard rankings. This README provides a comprehensive overview of the prototype’s architecture and workflows, tailored for hackathon judges evaluating Web3 innovation.
Table of Contents

    Vision and Value Proposition (#vision-and-value-proposition)
    System Architecture (#system-architecture)
    Components (#components)
    Gameplay Loop (#gameplay-loop)
    Score Submission Flow (#score-submission-flow)
    Contract Validation (#contract-validation)
    Social Integration (#social-integration)
    Rewards Distribution (#rewards-distribution)
    User Feedback (#user-feedback)
    Technical Highlights (#technical-highlights)
    Security Considerations (#security-considerations)
    Scalability and Future Potential (#scalability-and-future-potential)
    Open-Source Scope (#open-source-scope)
    Hackathon Relevance (#hackathon-relevance)
    Sequence Diagram (#sequence-diagram)
    License (#license)

Vision and Value Proposition
BEAMN Arcade envisions a gaming ecosystem where players compete fairly, own their achievements, and connect with a global community. This open-source prototype illustrates how blockchain ensures transparent score tracking, decentralized storage preserves data integrity, and social integration fosters engagement. For hackathon judges, BEAMN Arcade demonstrates a practical Web3 application, combining gaming with decentralized technologies to create a fun, secure, and rewarding experience. The prototype’s 0.25 GHO fee per score submission hints at a sustainable model, while the full version will introduce advanced features to differentiate it in the market.
System Architecture
The BEAMN Arcade prototype is a modular system integrating client-side gaming, front-end interfaces, backend services, decentralized storage, and blockchain components. It balances accessibility with security, allowing players to enjoy BlokDrop, submit scores, and simulate social sharing. The architecture is designed for extensibility, supporting future enhancements while protecting proprietary elements for the commercial release. The sequence diagram (see Sequence Diagram (#sequence-diagram)) visualizes these interactions, offering clarity on the system’s workflows.
Components

    User: Players interacting with BlokDrop on a mobile device or browser (device restrictions are disabled for demo purposes).
    Phaser Game Client: A JavaScript-based game built with Phaser, implementing basic BlokDrop mechanics (standard Tetris blocks, score tracking).
    Front-End Interface: A minimal HTML/CSS interface for displaying game data, handling score submissions, and simulating social interactions.
    Backend Service: A mock API that simulates score signing, representing the authorized signer’s role without exposing proprietary logic.
    Decentralized Storage: A testnet IPFS node for storing game data as JSON, demonstrating immutability.
    Wallet Provider: A Web3 wallet (e.g., Family Wallet) for user authentication and transaction signing in a test environment.
    Smart Contract: A testnet-deployed Solidity contract (DailyGameScore.sol) managing scores, leaderboards, and SBTs, with placeholder parameters.
    Social Protocol: A mock social layer simulating Lens Protocol V3, outputting JSON to represent shared achievements.

Gameplay Loop
Players launch BlokDrop, stacking blocks to clear lines and earn points. The game tracks score, lines, and level, sharing these with the front-end. The front-end authenticates the player via a wallet, storing game data (player, score, nonce, timestamp) as JSON in a testnet IPFS node, which returns a Content ID (CID). The front-end requests a signature from the mock backend, which simulates signing the player, score, and nonce. The signed data is submitted to the testnet smart contract with a 0.25 GHO fee (using test tokens). The contract mints an SBT to the player’s wallet, and the front-end generates a JSON output simulating a social post. Players qualify for demo rewards based on a simplified leaderboard.
Score Submission Flow
Players initiate score submission through the front-end’s “Submit Score” button, which displays a demo deadline. The front-end retrieves the game’s score, lines, and level and queries the testnet contract for the player’s nonce. After wallet authentication, game data is saved to IPFS, returning a CID. The front-end sends the data to the mock backend, which verifies the score and returns a simulated signature. The front-end submits the signed score to the contract, paying a testnet fee. If the submission fails, the front-end displays an error, ensuring clear user communication.
Contract Validation
The testnet DailyGameScore contract validates submissions by:

    Checking the simulated signature for authenticity.
    Verifying the 0.25 GHO test fee.
    Updating the player’s score if it exceeds their previous best.
    Maintaining a top 5 leaderboard.
    Emitting events for transparency.
    Minting SBTs to the player’s wallet.

This ensures fair score recording in the demo environment.
Social Integration
Upon score submission, the contract emits an SBT event with metadata. The front-end generates a JSON output mimicking a Lens Protocol post, simulating how players share achievements. The full version will integrate with Lens Protocol V3 for on-chain social engagement, a feature reserved for commercial release.
Rewards Distribution
The prototype includes a simplified reward system where top leaderboard players receive test tokens weekly, triggered by a contract function. The full version will feature a sophisticated reward model, details of which are proprietary.
User Feedback
The front-end provides feedback, confirming successful submissions and SBT minting or displaying errors for failed attempts, enhancing usability in the demo.
Technical Highlights
The prototype showcases:

    Decentralized Storage: Testnet IPFS for immutable game data.
    Blockchain Integration: Testnet smart contract for scores and SBTs.
    Web3 Authentication: Wallet-based user verification.
    Simulated Social Sharing: JSON outputs representing social posts.
    Fee Mechanism: 0.25 GHO test fees for ecosystem sustainability.

These features demonstrate Web3 integration while reserving advanced functionality for the full version.
Security Considerations
The prototype prioritizes security:

    Contract Protections: Uses standard libraries to prevent common vulnerabilities.
    Mock Backend: Simulates signing without exposing real logic.
    Testnet Deployment: Isolates the demo from production risks.
    Immutable Storage: Ensures data integrity via IPFS.

The full version will implement additional proprietary security measures.
Scalability and Future Potential
The prototype’s modular design supports adding games and scaling to larger player bases. The full version will leverage optimized infrastructure and advanced features (e.g., multiplayer modes, enhanced rewards), ensuring market competitiveness.
Open-Source Scope
This open-source prototype provides a functional subset of BEAMN Arcade, integrating basic gameplay, testnet blockchain features, and simulated social sharing. It excludes proprietary elements such as:

    Full backend signing logic.
    Production storage configurations.
    Sensitive contract parameters.
    Real social protocol integration.
    Advanced game mechanics and UI/UX.
    Detailed economic and reward models.
    Production infrastructure details.

These omissions ensure the commercial version retains its competitive edge, offering enhanced features, security, and user experience.
Hackathon Relevance
BEAMN Arcade excels as a hackathon submission:

    Innovation: Combines gaming, blockchain, and social Web3 features.
    Technical Depth: Integrates Phaser, Solidity, IPFS, and Web3 wallets.
    User Focus: Delivers a fun, rewarding demo.
    Decentralization: Embraces transparency and user ownership.
    Scalability: Built for future growth.

It appeals to judges seeking impactful Web3 solutions.
Sequence Diagram
The sequence diagram illustrates the prototype’s interactions, covering gameplay, score submission, validation, and simulated social sharing.
BEAMN Arcade Sequence Diagram
The diagram highlights:

    Gameplay and score tracking.
    Testnet storage and signing.
    Blockchain submission and SBT minting.
    Simulated social sharing.
    Demo reward distribution.

Note: The diagram is hosted in the project’s GitHub repository. Ensure accessibility for hackathon judges by verifying the URL or including the image in your submission.
License
MIT License
Created by Sunshine Vendetta
This README is tailored for a hackathon, showcasing BEAMN Arcade’s open-source prototype while protecting proprietary elements critical to the full version’s business success. The sequence diagram enhances clarity, and the focus on innovation and Web3 integration makes it a compelling submission. Replace the diagram URL with your actual hosted image path and verify its accessibility. Let me know if you need further assistance with the hackathon submission or additional refinements!