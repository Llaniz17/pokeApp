import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Link } from 'expo-router'
import { Pokemon, getPokemon } from '@/api/pokeapi';
import { ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const Page = () => {
  const [pokemon, setPokemon] = useState<Pokemon[]>([]);
  useEffect(() => {
    const load = async () => {
      const result = await getPokemon();
      setPokemon(result);
    }
    load();
  }, []);
  return (
    <ScrollView>
      {pokemon.map((p) => (
        <Link href={`/(pokemon)/${p.id}`} key={p.id} asChild>
          <TouchableOpacity>
            <View style={styles.item}>
              <Image source={{ uri: p.image}} style={styles.preview}/>
              <Text style={styles.itemText}>{p.name}</Text>
              <Ionicons name="chevron-forward" size={24} />
            </View>
          </TouchableOpacity>
        </Link>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  item: {
    padding: 10,
    height: 100,
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
  }, 
  itemText: {
    fontSize: 18,
    textTransform: 'capitalize',
    flex: 1,
  },
  preview: {
    height: 100,
    width: 100,
  }
})

export default Page