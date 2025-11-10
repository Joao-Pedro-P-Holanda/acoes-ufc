import { styles } from '@/app/actions/create.styles';
import { Building2, Users } from 'lucide-react-native';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface GroupTypeStepProps {
  onOwnGroupSelect: () => void;
  onExternalGroupSelect: () => void;
}

export function GroupTypeStep({ onOwnGroupSelect, onExternalGroupSelect }: GroupTypeStepProps) {
  return (
    <>
      <Text style={styles.formTitle}>Criar Célula</Text>
      <Text style={styles.formSubtitle}>Escolha o tipo de célula que deseja criar:</Text>

      <View style={styles.groupOptionContainer}>
        <TouchableOpacity 
          style={styles.cardGroupOptionContainer}
          onPress={onOwnGroupSelect}
        >
          <View style={styles.iconWrapper}>
            <Users size={48} color="#10B981" strokeWidth={2} />
          </View>
          <Text style={styles.optionTitle}>Célula própria</Text>
          <Text style={styles.optionDescription}>Criar uma célula na UFC</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.cardGroupOptionContainer}
          onPress={onExternalGroupSelect}
        >
          <View style={styles.iconWrapper}>
            <Building2 size={48} color="#10B981" strokeWidth={2} />
          </View>
          <Text style={styles.optionTitle}>Iniciativa externa</Text>
          <Text style={styles.optionDescription}>Compartilhar grupo externo</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}
