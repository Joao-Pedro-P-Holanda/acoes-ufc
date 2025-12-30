import { ErrorMessage } from '@/components/error-message';
import { CellFormData } from '@/schemas/cell.schema';
import { styles } from '@/styles/actions-create.styles';
import { X } from 'lucide-react-native';
import React, { useState } from 'react';
import { Control, FieldError, FieldErrors, useFieldArray } from 'react-hook-form';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface OrganizersStepProps {
  control: Control<CellFormData>;
  errors: FieldErrors<CellFormData>;
}

export function OrganizersStep({
  control,
  errors
}: OrganizersStepProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'organizers',
  });

  const [showForm, setShowForm] = useState(false);

  const handleAddOrganizer = (name: string, studentId: string) => {
    if (name.trim() && studentId.trim()) {
      append({ name, studentId });
      setShowForm(false);
    }
  };

  return (
    <>
      <Text style={styles.formTitle}>Organizadores</Text>
      <Text style={styles.formSubtitle}>Adicione os organizadores da célula.</Text>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Organizadores adicionados ({fields.length})</Text>

        {fields.length === 0 ? (
          <Text style={localStyles.emptyMessage}>Nenhum organizador adicionado ainda</Text>
        ) : (
          <ScrollView style={localStyles.organizersList}>
            {fields.map((field, index) => (
              <View key={index} style={localStyles.organizerItem}>
                <View style={localStyles.organizerInfo}>
                  <Text style={localStyles.organizerName}>{field.name}</Text>
                  <Text style={localStyles.organizerStudentId}>Matrícula: {field.studentId}</Text>
                </View>
                {index > 0 &&
                  <TouchableOpacity
                    onPress={() => remove(index)}
                    style={localStyles.removeButton}
                  >
                    <X size={20} color="#EF4444" />
                  </TouchableOpacity>

                }
              </View>
            ))}
          </ScrollView>
        )}

        {(errors.organizers as any)?.message && (
          <ErrorMessage error={errors.organizers as FieldError} />
        )}
      </View>

      {/* Formulário para adicionar novo organizador */}
      <View style={styles.formGroup}>
        {!showForm ? (
          <TouchableOpacity
            onPress={() => setShowForm(true)}
            style={localStyles.addButton}
          >
            <Text style={localStyles.addButtonText}>+ Adicionar Organizador</Text>
          </TouchableOpacity>
        ) : (
          <AddOrganizerForm
            onAdd={handleAddOrganizer}
            onCancel={() => setShowForm(false)}
          />
        )}
      </View>
    </>
  );
}

interface AddOrganizerFormProps {
  onAdd: (name: string, studentId: string) => void;
  onCancel: () => void;
}

function AddOrganizerForm({ onAdd, onCancel }: AddOrganizerFormProps) {
  const [name, setName] = useState('');
  const [studentId, setStudentId] = useState('');

  return (
    <View>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Nome do Organizador *</Text>
        <TextInput
          style={localStyles.input}
          onChangeText={setName}
          value={name}
          placeholder="Nome do organizador"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Matrícula *</Text>
        <TextInput
          style={localStyles.input}
          onChangeText={setStudentId}
          value={studentId}
          placeholder="Matrícula do estudante"
        />
      </View>

      <View style={localStyles.formActions}>
        <TouchableOpacity
          onPress={onCancel}
          style={[localStyles.button, localStyles.cancelButton]}
        >
          <Text style={localStyles.cancelButtonText}>Cancelar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => onAdd(name, studentId)}
          style={[localStyles.button, localStyles.confirmButton]}
          disabled={!name.trim() || !studentId.trim()}
        >
          <Text style={localStyles.confirmButtonText}>Adicionar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const localStyles = StyleSheet.create({
  emptyMessage: {
    color: '#9CA3AF',
    fontSize: 14,
    fontStyle: 'italic',
    marginVertical: 12,
  },
  organizersList: {
    maxHeight: 200,
    marginVertical: 12,
  },
  organizerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 8,
  },
  organizerInfo: {
    flex: 1,
  },
  organizerName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  organizerStudentId: {
    fontSize: 12,
    color: '#6B7280',
  },
  removeButton: {
    padding: 8,
    marginLeft: 8,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: '#000000',
  },
  textInput: {
    color: '#000000',
  },
  addButton: {
    backgroundColor: '#10B981',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  formActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#E5E7EB',
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  cancelButtonText: {
    color: '#374151',
    fontSize: 14,
    fontWeight: '600',
  },
  confirmButton: {
    backgroundColor: '#10B981',
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});
