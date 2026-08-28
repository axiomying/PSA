// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @notice Research interface for a policy-bound PSA treasury executor.
/// @dev No implementation or deployment is included in this repository.
interface IPSAExecutor {
    event DecisionExecuted(
        bytes32 indexed decisionId,
        bytes32 indexed policyHash,
        uint64 executedAt
    );

    event ExecutionPaused(address indexed account);
    event ExecutionResumed(address indexed account);

    function validateTarget(
        bytes32 policyHash,
        address[] calldata assets,
        uint16[] calldata targetWeightsBps
    ) external view returns (bool admissible, bytes32 reasonCode);

    function executeDecision(
        bytes32 decisionId,
        bytes32 policyHash,
        address[] calldata assets,
        uint16[] calldata targetWeightsBps
    ) external;

    function paused() external view returns (bool);
}
