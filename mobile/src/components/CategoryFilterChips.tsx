import React from 'react';
import { View, ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native';

export default function CategoryFilterChips({
  categories,
  activeCategory,
  onSelectCategory,
  isDark,
}) {
  return (
    <View style={styles.filterWrapper}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterScroll}
      >
        {categories.map((cat) => {
          const isActive = cat === activeCategory;
          return (
            <TouchableOpacity
              key={cat}
              onPress={() => onSelectCategory(cat)}
              style={[
                styles.filterChip,
                {
                  backgroundColor: isActive ? '#2E4A2E' : 'transparent',
                  borderColor: isActive ? 'transparent' : isDark ? '#2D4536' : '#DDD4C8',
                },
              ]}
            >
              <Text
                style={[
                  styles.filterText,
                  {
                    color: isActive ? '#FAF6F0' : isDark ? '#A2B3A7' : '#5A4E43',
                    fontWeight: isActive ? '700' : '500',
                  },
                ]}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  filterWrapper: {
    marginTop: 16,
  },
  filterScroll: {
    paddingHorizontal: 22,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 50,
    borderWidth: 1.5,
  },
  filterText: {
    fontSize: 13,
  },
});