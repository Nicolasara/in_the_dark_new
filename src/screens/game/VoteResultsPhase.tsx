import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Player } from "../../types/player";
import { analyzeVotingResults } from "../../utils/voting";
import { getPlayersInTheDark } from "../../utils/players";

interface VoteResultsPhaseProps {
  players: Player[];
  onPhaseComplete: () => void;
}

export const VoteResultsPhase: React.FC<VoteResultsPhaseProps> = ({
  players,
  onPhaseComplete,
}) => {
  const playersInTheDark = getPlayersInTheDark(players);

  // Use utility function to analyze voting results
  const { mostVotedPlayers, wasCorrectlyIdentified, isTie, tieBreakWinner } =
    analyzeVotingResults(players);

  // Determine the result based on the new tie logic
  const playersWon = isTie
    ? tieBreakWinner === "inTheLoop" // In tie situations, check who won the tiebreak
    : wasCorrectlyIdentified;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Voting Results</Text>

      <View style={styles.resultBox}>
        <Text style={styles.resultText}>
          {isTie
            ? "It's a tie!"
            : playersWon
            ? "The players correctly identified who was in the dark!"
            : "The players did not correctly identify who was in the dark."}
        </Text>
        {isTie && (
          <Text style={styles.tieText}>
            {tieBreakWinner === "inTheLoop"
              ? "All tied players are in the dark! In the loop team wins!"
              : tieBreakWinner === "inTheDark"
              ? "All tied players are in the loop! In the dark team wins!"
              : "Mixed tie - partial success for both teams!"}
          </Text>
        )}
      </View>

      <Text style={styles.subtitle}>Vote Distribution</Text>
      <ScrollView style={styles.votesList}>
        {players.map((player, index) => (
          <View key={index} style={styles.voteItem}>
            <Text style={styles.playerName}>{player.name}</Text>
            <Text style={styles.voteCount}>{player.votes} votes</Text>
            {player.isInTheDark && (
              <Text style={styles.inTheDarkTag}>In the Dark</Text>
            )}
            {mostVotedPlayers.includes(player) && (
              <Text style={styles.mostVotedTag}>Most Voted</Text>
            )}
          </View>
        ))}
      </ScrollView>

      <TouchableOpacity style={styles.continueButton} onPress={onPhaseComplete}>
        <Text style={styles.continueButtonText}>Continue to Guessing</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#1a1a1a",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#ffffff",
    textAlign: "center",
    marginTop: 20,
  },
  resultBox: {
    backgroundColor: "#2a2a2a",
    padding: 20,
    borderRadius: 8,
    marginTop: 20,
    marginBottom: 30,
  },
  resultText: {
    fontSize: 24,
    color: "#ffffff",
    textAlign: "center",
    fontWeight: "bold",
  },
  tieText: {
    fontSize: 20,
    color: "#cccccc",
    textAlign: "center",
    marginTop: 10,
  },
  subtitle: {
    fontSize: 24,
    color: "#cccccc",
    textAlign: "center",
    marginBottom: 20,
  },
  votesList: {
    flex: 1,
  },
  voteItem: {
    backgroundColor: "#2a2a2a",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  playerName: {
    fontSize: 20,
    color: "#ffffff",
    fontWeight: "bold",
    flex: 1,
  },
  voteCount: {
    fontSize: 18,
    color: "#cccccc",
    marginRight: 10,
  },
  inTheDarkTag: {
    fontSize: 16,
    color: "#4CAF50",
    fontWeight: "bold",
    marginRight: 10,
  },
  mostVotedTag: {
    fontSize: 16,
    color: "#FFC107",
    fontWeight: "bold",
  },
  continueButton: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  continueButtonText: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "bold",
  },
});
