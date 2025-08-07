export enum TournamentResponseMessages {
    // Invalid or expired authentication token
    ERR_INVALID_TOKEN = "ERR_INVALID_TOKEN",

    // Internal server error during token validation
    ERR_INTERNAL_SERVER = "ERR_INTERNAL_SERVER",

    // Tournament name field is missing in the request
    ERR_TOURNAMENT_NAME_REQUIRED = "ERR_TOURNAMENT_NAME_REQUIRED",

    // Tournament name cannot be empty or contain only whitespace
    ERR_TOURNAMENT_NAME_EMPTY = "ERR_TOURNAMENT_NAME_EMPTY",

    // Tournament name can only contain letters and numbers
    ERR_TOURNAMENT_NAME_INVALID_CHARS = "ERR_TOURNAMENT_NAME_INVALID_CHARS",

    // Tournament name already exists in the system
    ERR_TOURNAMENT_NAME_EXISTS = "ERR_TOURNAMENT_NAME_EXISTS",

    // Participant is already in another tournament
    ERR_PARTICIPANT_ALREADY_IN_TOURNAMENT = "ERR_PARTICIPANT_ALREADY_IN_TOURNAMENT",

    // Tournament name exceeds the maximum length of 20 characters
    ERR_TOURNAMENT_NAME_TOO_LONG = "ERR_TOURNAMENT_NAME_TOO_LONG",

    // Tournament created successfully
    SUCCESS_TOURNAMENT_CREATED = "SUCCESS_TOURNAMENT_CREATED",

    // Tournament cannot have more than 10 participants
    ERR_MAX_10_PARTICIPANTS = "ERR_MAX_10_PARTICIPANTS",

    // Tournament is not in a state to join
    ERR_TOURNAMENT_NOT_JOINABLE = "ERR_TOURNAMENT_NOT_JOINABLE",

    // Participant already joined a tournament
    ERR_PARTICIPANT_ALREADY_JOINED = "ERR_PARTICIPANT_ALREADY_JOINED",

    // Tournament not found
    ERR_TOURNAMENT_NOT_FOUND = "ERR_TOURNAMENT_NOT_FOUND",

    // Participant isn't found in the tournament
    ERR_PARTICIPANT_NOT_FOUND = "ERR_PARTICIPANT_NOT_FOUND",

    // Tournament admin cannot leave the tournament
    ERR_ADMIN_CANNOT_LEAVE = "ERR_ADMIN_CANNOT_LEAVE",

    // No ongoing rounds found in the tournament
    ERR_NO_ONGOING_ROUNDS = "ERR_NO_ONGOING_ROUNDS",

    // No completed rounds found in the tournament
    ERR_NO_COMPLETED_ROUNDS = "ERR_NO_COMPLETED_ROUNDS",

    // Tournament is not in a state to be deleted
    ERR_TOURNAMENT_NOT_DELETABLE = "ERR_TOURNAMENT_NOT_DELETABLE",

    // Only the tournament admin can delete the tournament
    ERR_ONLY_ADMIN_CAN_DELETE = "ERR_ONLY_ADMIN_CAN_DELETE",

    // Tournament isn't found for the given UUID
    ERR_TOURNAMENT_NOT_FOUND_UUID = "ERR_TOURNAMENT_NOT_FOUND_UUID",

    // Only the tournament admin can start the tournament
    ERR_ONLY_ADMIN_CAN_START = "ERR_ONLY_ADMIN_CAN_START",

    // Tournament is not in a state to be started
    ERR_TOURNAMENT_NOT_STARTABLE = "ERR_TOURNAMENT_NOT_STARTABLE",

    // Not enough participants to start the tournament
    ERR_NOT_ENOUGH_PARTICIPANTS = "ERR_NOT_ENOUGH_PARTICIPANTS",

    // Match status for a participant is not joinable
    ERR_MATCH_NOT_JOINABLE = "ERR_MATCH_NOT_JOINABLE",

    // Participant is disconnected and cannot be a winner
    ERR_PARTICIPANT_DISCONNECTED = "ERR_PARTICIPANT_DISCONNECTED",

    // Winner added successfully
    SUCCESS_WINNER_ADDED = "SUCCESS_WINNER_ADDED",

    // Tournament completed successfully
    SUCCESS_TOURNAMENT_COMPLETED = "SUCCESS_TOURNAMENT_COMPLETED",

    // Winner added and the next round started successfully
    SUCCESS_NEXT_ROUND_STARTED = "SUCCESS_NEXT_ROUND_STARTED",

    // Tournament is not in a state to join matches
    ERR_TOURNAMENT_NOT_MATCH_JOINABLE = "ERR_TOURNAMENT_NOT_MATCH_JOINABLE",

    // Round isn't found in a tournament
    ERR_ROUND_NOT_FOUND = "ERR_ROUND_NOT_FOUND",

    // Round is already completed
    ERR_ROUND_COMPLETED = "ERR_ROUND_COMPLETED",

    // Match for a participant is not in a state to join
    ERR_MATCH_STATE_NOT_JOINABLE = "ERR_MATCH_STATE_NOT_JOINABLE",

    // Match for a participant is not in a state to leave
    ERR_MATCH_STATE_NOT_LEAVABLE = "ERR_MATCH_STATE_NOT_LEAVABLE",

    // Participant is not in the tournament
    ERR_PARTICIPANT_NOT_IN_TOURNAMENT = "ERR_PARTICIPANT_NOT_IN_TOURNAMENT",

    // Participant is already joined in the match
    ERR_PARTICIPANT_ALREADY_IN_MATCH = "ERR_PARTICIPANT_ALREADY_IN_MATCH",

    // Participant is already disconnected
    ERR_PARTICIPANT_ALREADY_DISCONNECTED = "ERR_PARTICIPANT_ALREADY_DISCONNECTED",

    // Participant joined tournament successfully
    SUCCESS_PARTICIPANT_JOINED = "SUCCESS_PARTICIPANT_JOINED",

    // Participant left tournament successfully
    SUCCESS_PARTICIPANT_LEFT = "SUCCESS_PARTICIPANT_LEFT",

    // Tournament deleted successfully
    SUCCESS_TOURNAMENT_DELETED = "SUCCESS_TOURNAMENT_DELETED",

    // Participants retrieved successfully
    SUCCESS_PARTICIPANTS_RETRIEVED = "SUCCESS_PARTICIPANTS_RETRIEVED",

    // Tournament for UUID retrieved successfully
    SUCCESS_TOURNAMENT_RETRIEVED_UUID = "SUCCESS_TOURNAMENT_RETRIEVED_UUID",

    // Tournament started successfully
    SUCCESS_TOURNAMENT_STARTED = "SUCCESS_TOURNAMENT_STARTED",

    // Participant joined the match successfully
    SUCCESS_PARTICIPANT_JOINED_MATCH = "SUCCESS_PARTICIPANT_JOINED_MATCH",

    // Participant leaved the match successfully
    SUCCESS_PARTICIPANT_LEAVED_MATCH = "SUCCESS_PARTICIPANT_LEAVED_MATCH",

    // Participant isn't found in any match of round
    ERR_PARTICIPANT_NOT_FOUND_ROUND = "ERR_PARTICIPANT_NOT_FOUND_ROUND",

    // Tournament is not in a state to add winners
    ERR_TOURNAMENT_NOT_ADD_WINNERS = "ERR_TOURNAMENT_NOT_ADD_WINNERS",

    // No rounds found in the tournament
    ERR_NO_ROUNDS_FOUND = "ERR_NO_ROUNDS_FOUND",

    // Round number does not match the current active round
    ERR_ROUND_NUMBER_MISMATCH = "ERR_ROUND_NUMBER_MISMATCH",

    // Winner is not part of the current matches
    ERR_WINNER_NOT_IN_MATCHES = "ERR_WINNER_NOT_IN_MATCHES",

    // Rival participant has already won in this round
    ERR_RIVAL_ALREADY_WON = "ERR_RIVAL_ALREADY_WON",

    // Winner has already been added for this round
    ERR_WINNER_ALREADY_ADDED = "ERR_WINNER_ALREADY_ADDED",

}