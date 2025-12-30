import { TextInputField } from '@/components/text-input-field';
import { CommunityActionFormData } from '@/schemas/community-action.schema';
import { styles } from '@/styles/actions-create.styles';
import { X } from 'lucide-react-native';
import React from 'react';
import { Control, FieldErrors } from 'react-hook-form';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';

interface BasicInfoStepProps {
  control: Control<CommunityActionFormData>;
  errors: FieldErrors<CommunityActionFormData>;
  tags: string[];
  currentTag: string;
  onCurrentTagChange: (tag: string) => void;
  onAddTag: () => void;
  onRemoveTag: (tag: string) => void;
}

export function BasicInfoStep({
  control,
  errors,
  tags,
  currentTag,
  onCurrentTagChange,
  onAddTag,
  onRemoveTag,
}: BasicInfoStepProps) {
  return (
    <View>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Nome da Ação *</Text>
        <TextInputField
          control={control}
          name="name"
          error={errors.name}
          placeholder="Ex: Limpeza do Parque Central"
          placeholderTextColor="#9CA3AF"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Descrição *</Text>
        <TextInputField
          control={control}
          name="description"
          error={errors.description}
          placeholder="Descreva detalhadamente a ação comunitária..."
          placeholderTextColor="#9CA3AF"
          multiline
          numberOfLines={4}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Link Original (Opcional)</Text>
        <TextInputField
          control={control}
          name="originalLink"
          error={errors.originalLink}
          placeholder="https://exemplo.com/evento"
          placeholderTextColor="#9CA3AF"
          keyboardType="url"
          autoCapitalize="none"
        />
        <Text style={styles.hint}>
          Link para mais informações sobre a ação (site, formulário, etc.)
        </Text>
      </View>


      <View style={styles.formGroup}>
        <Text style={styles.label}>Tags *</Text>
        <View style={styles.tagInputRow}>
          <TextInput
            style={[styles.input, styles.tagInput]}
            value={currentTag}
            onChangeText={onCurrentTagChange}
            placeholder="Digite uma tag"
            placeholderTextColor="#9CA3AF"
            onSubmitEditing={onAddTag}
            autoComplete="off"
          />
          <TouchableOpacity
            onPress={onAddTag}
            style={styles.addTagButton}
          >
            <Text style={styles.addTagButtonText}>Adicionar</Text>
          </TouchableOpacity>
        </View>
        {tags.length > 0 && (
          <View style={styles.tagsContainer}>
            {tags.map((tag, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
                <TouchableOpacity onPress={() => onRemoveTag(tag)}>
                  <X color="#059669" size={14} />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
        {errors.tags && (
          <Text style={{ color: '#EF4444', fontSize: 12, marginTop: 4 }}>
            {errors.tags.message?.toString()}
          </Text>
        )}
      </View>
    </View>
  );
}
