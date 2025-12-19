import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Dimensions } from 'react-native';
import { COLORS } from '../constants/colors';
import { ChevronDown, Navigation, Clock, MapPin } from 'lucide-react-native';
import TrackingMap from './TrackingMap';

const { width, height } = Dimensions.get('window');

export default function NavigationModal({ visible, onClose, job, partnerLocation, routeInfo, onArrived }) {
    if (!job) return null;

    return (
        <Modal
            visible={visible}
            animationType="slide"
            presentationStyle="fullScreen"
            onRequestClose={onClose}
        >
            <View style={styles.container}>
                {/* Full Screen Map */}
                <View style={styles.mapContainer}>
                    <TrackingMap
                        job={job}
                        partnerLocation={partnerLocation}
                        showRoute={true}
                        variant="full"
                    />
                </View>

                {/* Header Overlay - Row Layout */}
                <View style={styles.headerOverlay}>
                    <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
                        <ChevronDown size={32} color={COLORS.white} />
                    </TouchableOpacity>

                    <View style={styles.directionBox}>
                        <Navigation size={20} color={COLORS.white} style={{ marginRight: 8 }} />
                        <View style={{ flex: 1 }}>
                            <Text style={styles.directionDist}>{routeInfo.distance}</Text>
                            <Text style={styles.directionText} numberOfLines={1}>
                                Head towards {job.location}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Bottom Floating Controls */}
                <View style={styles.bottomOverlay}>
                    {/* Compact Info Pill */}
                    <View style={styles.infoPill}>
                        <View style={styles.pillItem}>
                            <Clock size={14} color={COLORS.textLight} />
                            <Text style={styles.pillText}>{routeInfo.eta}</Text>
                        </View>
                        <View style={styles.pillDivider} />
                        <View style={styles.pillItem}>
                            <MapPin size={14} color={COLORS.textLight} />
                            <Text style={styles.pillText}>{routeInfo.distance}</Text>
                        </View>
                    </View>

                    <TouchableOpacity style={styles.arrivedBtn} onPress={onArrived}>
                        <Text style={styles.arrivedBtnText}>Mark As Arrived</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    mapContainer: {
        flex: 1,
    },
    headerOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        paddingTop: 50,
        paddingHorizontal: 16,
        flexDirection: 'row', // Row layout
        alignItems: 'flex-start', // Align top
    },
    closeBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12, // Space between back btn and info box
    },
    directionBox: {
        flex: 1, // Take remaining width
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.primary,
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 12,
        elevation: 6,
        minHeight: 50,
    },
    directionDist: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.white,
    },
    directionText: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.9)',
        marginTop: 1,
    },
    bottomOverlay: {
        position: 'absolute',
        bottom: 30,
        left: 16,
        right: 16,
        alignItems: 'center',
    },
    infoPill: {
        flexDirection: 'row',
        backgroundColor: COLORS.surface,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        elevation: 4,
        marginBottom: 16,
        alignItems: 'center',
    },
    pillItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    pillDivider: {
        width: 1,
        height: 12,
        backgroundColor: COLORS.border,
        marginHorizontal: 12,
    },
    pillText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    arrivedBtn: {
        backgroundColor: COLORS.success,
        paddingVertical: 16,
        width: '100%',
        borderRadius: 16,
        alignItems: 'center',
        elevation: 4,
    },
    arrivedBtnText: {
        color: COLORS.white,
        fontWeight: 'bold',
        fontSize: 16,
    }
});
