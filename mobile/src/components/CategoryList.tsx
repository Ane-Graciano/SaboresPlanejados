import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';

interface Category {
  id: string;
  emoji: string;
  label: string;
}

interface CategoryListProps {
  categorias: Category[];
  selectedCategory: string | null;
  onSelectCategory: (id: string | null) => void;
  isDark?: boolean;
}

export const CategoryList: React.FC<CategoryListProps> = ({
  categorias,
  selectedCategory,
  onSelectCategory,
  isDark = false,
}) => {
  return (
    <View>
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: isDark ? '#FAF6F0' : '#2C2016' }]}>
          Categorias
        </Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
        {categorias.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <TouchableOpacity 
              key={cat.id} 
              style={styles.categoryItem} 
              activeOpacity={0.7}
              onPress={() => onSelectCategory(isSelected ? null : cat.id)}
            >
              <View style={[
                styles.categoryCircle, 
                { backgroundColor: isSelected ? '#2E4A2E' : (isDark ? '#1B2E23' : '#F0EAE0') }
              ]}>
                <Text style={{ fontSize: 20 }}>{cat.emoji}</Text>
              </View>
              <Text style={[
                styles.categoryLabel, 
                { 
                  color: isSelected ? '#2E4A2E' : (isDark ? '#A2B3A7' : '#5A4E43'),
                  fontWeight: isSelected ? '700' : '500'
                }
              ]}>
                {cat.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  sectionHeader: { paddingHorizontal: 22, marginTop: 20, marginBottom: 12 },
  sectionTitle: { fontSize: 17, fontWeight: '700' },
  horizontalScroll: { paddingLeft: 22 },
  categoryItem: { alignItems: 'center', marginRight: 16 },
  categoryCircle: { width: 46, height: 46, borderRadius: 23, justifyContent: 'center', alignItems: 'center', marginBottom: 6 },
  categoryLabel: { fontSize: 10.5 },
});