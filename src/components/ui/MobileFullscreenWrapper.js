import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Platform, Dimensions } from 'react-native';

/**
 * Mobile Fullscreen Wrapper
 * Ensures proper fullscreen behavior on mobile devices
 */
export default function MobileFullscreenWrapper({ children }) {
    const [dimensions, setDimensions] = useState(Dimensions.get('window'));

    useEffect(() => {
        const subscription = Dimensions.addEventListener('change', ({ window }) => {
            setDimensions(window);
        });

        return () => subscription?.remove();
    }, []);

    // Mobile-specific fullscreen handling
    useEffect(() => {
        if (Platform.OS !== 'web') {
            // Force layout update on mobile
            const timer = setTimeout(() => {
                setDimensions(Dimensions.get('window'));
            }, 100);

            return () => clearTimeout(timer);
        }
    }, []);

    const styles = StyleSheet.create({
        container: {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: dimensions.width,
            height: dimensions.height,
            backgroundColor: '#000',
            overflow: 'hidden',
            // Mobile-specific styles
            ...(Platform.OS !== 'web' && {
                flex: 1,
                zIndex: 0,
            }),
            // Web mobile styles
            ...(Platform.OS === 'web' && {
                minWidth: '100vw',
                minHeight: '100vh',
                maxWidth: '100vw',
                maxHeight: '100vh',
            }),
        },
    });

    return (
        <View style={styles.container}>
            {children}
        </View>
    );
}