
import React from "react";
import { View, Text, Platform } from "react-native";
import PillarJumpGame from "./src/components/PillarJumpGame";

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('App Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={{ 
          flex: 1, 
          justifyContent: 'center', 
          alignItems: 'center', 
          backgroundColor: '#000',
          padding: 20 
        }}>
          <Text style={{ 
            color: '#fff', 
            fontSize: 18, 
            textAlign: 'center',
            marginBottom: 20 
          }}>
            Something went wrong loading the game.
          </Text>
          <Text style={{ 
            color: '#888', 
            fontSize: 14, 
            textAlign: 'center',
            marginBottom: 20 
          }}>
            Please refresh the page to try again.
          </Text>
          {Platform.OS === 'web' && (
            <button 
              onClick={() => window.location.reload()}
              style={{
                backgroundColor: '#007AFF',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '8px',
                fontSize: '16px',
                cursor: 'pointer'
              }}
            >
              Refresh Page
            </button>
          )}
        </View>
      );
    }

    return this.props.children;
  }
}

export default function App() {
  return (
    <ErrorBoundary>
      <View style={{ flex: 1, backgroundColor: '#000' }}>
        <PillarJumpGame />
      </View>
    </ErrorBoundary>
  );
}
