import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

interface QuickFiltersProps {
  filtros: string[];
  activeFilter: string;
  onSelectFilter: (filtro: string) => void;
  hasActiveFilters: boolean;
  onClearFilters: () => void;
  isDark?: boolean;
}

export const QuickFilters: React.FC<QuickFiltersProps> = ({
  filtros,
  activeFilter,
  onSelectFilter,
  hasActiveFilters,
  onClearFilters,
  isDark = false,
}) => {
  return (
    <View style={styles.filterHeaderContainer}>
      <View style={styles.filterContainer}>
        {filtros.map((f) => {
          const isActive = f === activeFilter;
          return (
            <TouchableOpacity
              key={f}
              onPress={() => onSelectFilter(f)}
              style={[
                styles.filterChip,
                {
                  backgroundColor: isActive ? '#2E4A2E' : 'transparent',
                  borderColor: isActive ? 'transparent' : (isDark ? '#2D4536' : '#DDD4C8'),
                },
              ]}
            >
              <Text style={[
                styles.filterText, 
                { color: isActive ? '#FAF6F0' : (isDark ? '#A2B3A7' : '#5A4E43'), fontWeight: isActive ? '700' : '500' }
              ]}>
                {f}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {hasActiveFilters && (
        <TouchableOpacity onPress={onClearFilters} style={styles.clearFilterBtn}>
          <Text style={styles.clearFilterText}>Limpar</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  filterHeaderContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingRight: 22 },
  filterContainer: { flexDirection: 'row', gap: 8, paddingHorizontal: 22, marginTop: 14 },
  filterChip: { paddingHorizontal: 18, paddingVertical: 7, borderRadius: 50, borderWidth: 1.5 },
  filterText: { fontSize: 13 },
  clearFilterBtn: { marginTop: 14 },
  clearFilterText: { fontSize: 12.5, fontWeight: '600', color: '#C46B3E' },
});