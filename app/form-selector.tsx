import { styles } from '@/app/actions/create.styles';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Users, Building2 } from "lucide-react-native";
import { useRouter } from 'expo-router';


export default function FormSelector() {
 const router = useRouter()
 return (
  <>
   <Text style={styles.formTitle}>Criar Célula</Text>
   <Text style={styles.formSubtitle}>Escolha o tipo de célula que deseja criar:</Text>

   <View style={styles.groupOptionContainer}>
    <TouchableOpacity
     style={styles.cardGroupOptionContainer}
     onPress={() => router.push("/actions/create")}
    >
     <View style={styles.iconWrapper}>
      <Users size={48} color="#10B981" strokeWidth={2} />
     </View>
     <Text style={styles.optionTitle}>Célula própria</Text>
     <Text style={styles.optionDescription}>Criar uma célula na UFC</Text>
    </TouchableOpacity>

    <TouchableOpacity
     style={styles.cardGroupOptionContainer}
     onPress={() => router.push("/extracurricular-groups/create")}
    >
     <View style={styles.iconWrapper}>
      <Building2 size={48} color="#10B981" strokeWidth={2} />
     </View>
     <Text style={styles.optionTitle}>Iniciativa externa</Text>
     <Text style={styles.optionDescription}>Compartilhar grupo externo</Text>
    </TouchableOpacity>
   </View>
  </>
 )
}
