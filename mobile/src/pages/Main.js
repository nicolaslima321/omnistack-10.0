import React, { useEffect, useState } from 'react'
import { Text, TextInput, Image, View, StyleSheet, TouchableOpacity } from 'react-native'
import MapView, { Marker, Callout } from 'react-native-maps'
import { requestPermissionsAsync, getCurrentPositionAsync } from 'expo-location'
import { MaterialIcons } from '@expo/vector-icons'

import api from '../services/api'

export default function Main({ navigation }) {
	const [devs, setDevs] = useState([])
	const [currentRegion, setCurrentRegion] = useState(null)

	useEffect(() => {
		async function loadInitialPosition() {
			// Desestruturação de um objeto **conceito inportante
			const { granted } = await requestPermissionsAsync()
			if (granted) {
				const location = await getCurrentPositionAsync({
					enableHighAccuracy: true,
				})

				const { latitude, longitude } = location.coords

				setCurrentRegion({
					latitude,
					longitude,
					latitudeDelta: 0.04,
					longitudeDelta: 0.04,
				})
			}
		}

		loadInitialPosition()
	}, [])

	async function loadDevs() {
		const { latitude, longitude } = currentRegion
		console.log('Please Work..!')

		const response = await api.get('/search' , {
			params: {
				latitude,
				longitude,
				techs: 'PHP'
			}
		})

		console.log('test')
		console.log(response.status)

		setDevs(response.data.devs)
	}

	function handleRegionChanged(region) {
		console.log(region)
		setCurrentRegion(region)
	}

	if (!currentRegion) return null

  return (
		<>
			<MapView 
				onRegionChangeComplete={handleRegionChanged}
				initialRegion={currentRegion} 
				style={styles.map}
			>
				{devs.map(dev => {
					<Marker
						key={dev._id}
						coordinate={{ longitude: dev.location.coordinates[0], latitude: dev.location.coordinates[1] }}
					>
					<Image 
						style={styles.avatar} 
						source={{ uri: dev.avatar_url }} 
					/>
					<Callout onPress={() => {
						// Navegação para página do GitHub
						navigation.navigate('Profile', { github_username: dev.github_username })
					}}>
						<View style={styles.callout}>
							<Text style={styles.devName}>{dev.name}</Text>
							<Text style={styles.devBio}>{dev.bio}</Text>
							<Text style={styles.devTechs}>{dev.techs.join(', ')}</Text>
						</View>
					</Callout>
				</Marker>
				})}
			</MapView>
			<View style={styles.searchForm}>
					<TextInput 
						style={styles.searchInput}
						placeholder="Buscar devs por tecnologias.."
						placeholderTextColor="#999"
						autoCapitalize="words"
						autoCorrect={false}
					/>
					<TouchableOpacity onPress={ loadDevs } style={styles.loadButton}>
						<MaterialIcons name="my-location" size={20} color="#FFF" />
					</TouchableOpacity>
			</View>
		</>
	)
}

const styles = StyleSheet.create({
	map: {
		flex: 1
	},

	avatar: {
		width: 54,
		height: 54,
		borderRadius: 4,
		borderWidth: 4,
		borderColor: '#FFF'
	},

	callout: {
		width: 260
	},

	devName: {
		fontWeight: 'bold',
		fontSize: 16
	},

	devBio: {
		color: '#666',
		marginTop: 5
	},

	devTechs: {
		marginTop: 5
	},

	searchForm: {
		position: 'absolute',
		// bottom: 20,
		top: 20,
		left: 20,
		right: 20,
		zIndex: 5,
		flexDirection: 'row'
	},

	searchInput: {
		flex: 1,
		height: 50,
		backgroundColor: '#FFF',
		color: '#333',
		borderRadius: 25,
		paddingHorizontal: 20,
		fontSize: 16,
		shadowColor: '#000',
		shadowOpacity: 0.2,
		shadowOffset: {
			width: 4,
			height: 4,
		},
		elevation: 2
	},

	loadButton: {
		width: 50,
		height: 50,
		backgroundColor: '#8E4DFF',
		borderRadius: 25,
		justifyContent: 'center',
		alignItems: 'center',
		marginLeft: 15
	}


})