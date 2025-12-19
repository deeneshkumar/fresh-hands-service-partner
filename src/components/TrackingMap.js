import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import { COLORS } from '../constants/colors';
import { MapPin, Navigation } from 'lucide-react-native';

const { width } = Dimensions.get('window');

const MAP_STYLE = [
    {
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#f5f5f5"
            }
        ]
    },
    {
        "elementType": "labels.icon",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#616161"
            }
        ]
    },
    {
        "elementType": "labels.text.stroke",
        "stylers": [
            {
                "color": "#f5f5f5"
            }
        ]
    },
    {
        "featureType": "administrative.land_parcel",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#bdbdbd"
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#eeeeee"
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#757575"
            }
        ]
    },
    {
        "featureType": "poi.park",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#e5e5e5"
            }
        ]
    },
    {
        "featureType": "poi.park",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#9e9e9e"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#ffffff"
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#757575"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#dadada"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#616161"
            }
        ]
    },
    {
        "featureType": "road.local",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#9e9e9e"
            }
        ]
    },
    {
        "featureType": "transit.line",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#e5e5e5"
            }
        ]
    },
    {
        "featureType": "transit.station",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#eeeeee"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#c9c9c9"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#9e9e9e"
            }
        ]
    }
];

export default function TrackingMap({ job, showRoute = true, partnerLocation, variant = 'card' }) {
    const mapRef = useRef(null);
    const { customerCoords } = job;

    // Use simulated partner location if provided, otherwise fallback to job's initial partner coords or default
    const currentPartnerCoords = partnerLocation || job.partnerCoords || { latitude: 28.4495, longitude: 77.0166 };

    useEffect(() => {
        if (mapRef.current && customerCoords && currentPartnerCoords) {
            mapRef.current.fitToCoordinates([currentPartnerCoords, customerCoords], {
                edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
                animated: true,
            });
        }
    }, [currentPartnerCoords, customerCoords]);

    const containerStyle = variant === 'full'
        ? styles.fullContainer
        : styles.cardContainer;

    return (
        <View style={containerStyle}>
            <MapView
                provider={PROVIDER_GOOGLE}
                ref={mapRef}
                style={styles.map}
                customMapStyle={MAP_STYLE}
                initialRegion={{
                    latitude: currentPartnerCoords.latitude,
                    longitude: currentPartnerCoords.longitude,
                    latitudeDelta: 0.05,
                    longitudeDelta: 0.05,
                }}
            >
                {/* Partner Marker (You) */}
                <Marker coordinate={currentPartnerCoords} title="You">
                    <View style={styles.partnerMarker}>
                        <Navigation size={20} color={COLORS.white} fill={COLORS.white} style={{ transform: [{ rotate: '45deg' }] }} />
                    </View>
                </Marker>

                {/* Customer Marker - Only show coordinates exist */}
                {customerCoords && (
                    <Marker coordinate={customerCoords} title="Customer">
                        <View style={styles.customerMarker}>
                            <MapPin size={24} color={COLORS.white} fill={COLORS.error} />
                        </View>
                    </Marker>
                )}

                {/* Route Line */}
                {showRoute && customerCoords && (
                    <Polyline
                        coordinates={[currentPartnerCoords, customerCoords]}
                        strokeColor={COLORS.primary}
                        strokeWidth={4}
                        lineDashPattern={[0]}
                    />
                )}
            </MapView>
        </View>
    );
}

const styles = StyleSheet.create({
    cardContainer: {
        height: 200,
        borderRadius: 16,
        overflow: 'hidden',
        marginBottom: 16,
        backgroundColor: COLORS.surface,
        elevation: 2,
        marginHorizontal: 16, // Added margin horizontal to prevent hitting screen edges
    },
    fullContainer: {
        flex: 1,
        width: '100%',
        height: '100%',
        backgroundColor: COLORS.surface,
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
    partnerMarker: {
        backgroundColor: COLORS.primary,
        padding: 8,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: COLORS.white,
        elevation: 4,
    },
    customerMarker: {
        // padding: 4,
        // backgroundColor: 'transparent'
    }
});
