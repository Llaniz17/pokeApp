import { View, Text, StyleSheet, Image } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { Pokemon, getPokemonDetail } from '@/api/pokeapi';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Page = () => {
    const { id } = useLocalSearchParams<{ id: string }>();
    const [details, setDetails] = useState<Pokemon>();
    const navigation = useNavigation();
    const [isFavorite, setIsFavorite] = useState<boolean>(false);

    useEffect(() => {
        const load = async () => {
            const details = await getPokemonDetail(id!);
            setDetails(details);
            navigation.setOptions({
                title: details.name.charAt(0).toUpperCase() + details.name.slice(1),
            });

            const isFavorite = await AsyncStorage.getItem(`favorite-${id}`);
            setIsFavorite(isFavorite == 'true');
        };
        load();
    }, [id]);

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <Text onPress={toggleFavorite}>
                    <Ionicons name={isFavorite ? 'star' : 'star-outline'} size={22} color={'#ffffff'} />
                </Text>
            ),
        });
    }, [isFavorite]);

    const toggleFavorite = async () => {
        await AsyncStorage.setItem(`favorite-${id}`, !isFavorite ? 'true' : 'false');
        setIsFavorite(!isFavorite);
    }



    return (
        <View style={{ padding: 10 }}>
            {details && (
                <>
                    <View style={[styles.card, { alignItems: 'center' }]}>
                        <Image source={{ uri: details.sprites.front_default }} style={{ width: 200, height: 200 }} />
                        <Text style={styles.name}>
                            #{details.id} {details.name}
                        </Text>
                    </View>
                    <View style={styles.card}>
                        <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Stats: </Text>
                        {details.stats.map((item: any) => (
                            <Text key={item.stat.name}>
                                {item.stat.name}: {item.base_stat}
                            </Text>
                        ))}
                    </View>
                </>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        padding: 10,
        margin: 10,
        elevation: 1,
        gap: 4,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 1,
        shadowOffset: {
            width: 0,
            height: 1,
        },

    },
    name: {
        fontSize: 20,
        fontWeight: 'bold',
        textTransform: 'capitalize',
    }
})


export default Page