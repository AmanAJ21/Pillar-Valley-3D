import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet, Platform, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { HapticFeedback } from '../../utils/hapticUtils';

const { width: screenWidth } = Dimensions.get('window');
const isSmallScreen = screenWidth < 375;
const isTablet = screenWidth >= 768;

/**
 * CleanButton Component - Matches the theme indicator design
 * Clean glass design with icon and text side by side
 */
export default function CleanButton({
    title,
    onPress,
    icon,
    variant = 'primary',
    size = 'medium',
    disabled = false,
    style,
    textStyle,
    iconColor,
    ...props
}) {
    const getVariantStyles = () => {
        switch (variant) {
            case 'primary':
                return {
                    backgroundColor: 'rgba(0, 122, 255, 0.15)', // iOS Blue with transparency
                    borderColor: 'rgba(0, 122, 255, 0.3)',
                };
            case 'secondary':
                return {
                    backgroundColor: 'rgba(142, 142, 147, 0.12)', // iOS Gray
                    borderColor: 'rgba(142, 142, 147, 0.25)',
                };
            case 'accent':
                return {
                    backgroundColor: 'rgba(0, 122, 255, 0.2)', // Stronger iOS Blue
                    borderColor: 'rgba(0, 122, 255, 0.4)',
                };
            default:
                return {
                    backgroundColor: 'rgba(0, 122, 255, 0.15)',
                    borderColor: 'rgba(0, 122, 255, 0.3)',
                };
        }
    };

    const getSizeStyles = () => {
        switch (size) {
            case 'small':
                return {
                    paddingHorizontal: isSmallScreen ? 16 : 20,
                    paddingVertical: isSmallScreen ? 8 : 10,
                    borderRadius: isSmallScreen ? 10 : 12, // Apple's preferred corner radius
                };
            case 'large':
                return {
                    paddingHorizontal: isSmallScreen ? 24 : 32,
                    paddingVertical: isSmallScreen ? 14 : 16,
                    borderRadius: isSmallScreen ? 14 : 16, // Larger Apple-style radius
                };
            default: // medium
                return {
                    paddingHorizontal: isSmallScreen ? 20 : 24,
                    paddingVertical: isSmallScreen ? 10 : 12,
                    borderRadius: isSmallScreen ? 12 : 14, // Apple's standard radius
                };
        }
    };

    const getTextStyles = () => {
        switch (size) {
            case 'small':
                return {
                    fontSize: isSmallScreen ? 14 : 15,
                    fontWeight: '600', // Apple's preferred weight
                    letterSpacing: -0.24, // Apple's letter spacing
                };
            case 'large':
                return {
                    fontSize: isSmallScreen ? 17 : 19,
                    fontWeight: '600', // Consistent Apple weight
                    letterSpacing: -0.41,
                };
            default:
                return {
                    fontSize: isSmallScreen ? 16 : 17,
                    fontWeight: '600',
                    letterSpacing: -0.32,
                };
        }
    };

    const getIconSize = () => {
        switch (size) {
            case 'small':
                return isSmallScreen ? 14 : 16;
            case 'large':
                return isSmallScreen ? 20 : 24;
            default:
                return isSmallScreen ? 16 : 18;
        }
    };

    const variantStyles = getVariantStyles();
    const sizeStyles = getSizeStyles();
    const textStyles = getTextStyles();
    const iconSize = getIconSize();

    const handlePress = () => {
        if (!disabled && onPress) {
            HapticFeedback.light();
            onPress();
        }
    };

    return (
        <TouchableOpacity
            style={[
                styles.cleanButton,
                sizeStyles,
                {
                    backgroundColor: variantStyles.backgroundColor,
                    borderColor: variantStyles.borderColor,
                },
                disabled && styles.disabled,
                style,
            ]}
            onPress={handlePress}
            activeOpacity={disabled ? 1 : 0.7}
            {...props}
        >
            <View style={styles.buttonContent}>
                {icon && (
                    <Icon
                        name={icon}
                        size={iconSize}
                        color={iconColor || (disabled ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.9)')}
                        style={styles.buttonIcon}
                    />
                )}
                {title && (
                    <Text
                        style={[
                            styles.buttonText,
                            textStyles,
                            {
                                color: disabled ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.9)',
                            },
                            textStyle,
                        ]}
                    >
                        {title}
                    </Text>
                )}
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    cleanButton: {
        borderWidth: 0.5, // Thinner Apple-style border
        backdropFilter: Platform.OS === 'web' ? 'blur(20px)' : undefined, // Stronger blur
        alignItems: 'center',
        justifyContent: 'center',
        // Apple-style shadow
        shadowColor: 'rgba(0, 0, 0, 0.15)',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 2,
    },
    buttonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6, // Tighter spacing like Apple
    },
    buttonIcon: {
        // Apple-style icon rendering
    },
    buttonText: {
        textAlign: 'center',
        opacity: 1, // Full opacity for Apple clarity
        includeFontPadding: false,
        fontFamily: Platform.OS === 'ios' ? 'SF Pro Display' : 'System', // Apple fonts
    },
    disabled: {
        opacity: 0.3, // Apple's disabled opacity
        backgroundColor: 'rgba(142, 142, 147, 0.06)',
        borderColor: 'rgba(142, 142, 147, 0.12)',
    },
});