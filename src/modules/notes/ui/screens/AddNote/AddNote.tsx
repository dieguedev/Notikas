import { StatusBar } from 'expo-status-bar'
import { Layout } from '../../../../../common/Layout/Layout'
import { Texto } from '../../../../../common/Texto/Texto'
import {
  View,
  StyleSheet,
  FlatList,
  Pressable,
  TextInput,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native'
import theme, { FileColor } from '../../../../../theme'
import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons'
import React, { useEffect, useState } from 'react'
import Animated, { ZoomIn } from 'react-native-reanimated'
import { Field, FieldProps, Formik, FormikErrors } from 'formik'
import { SafeAreaView } from 'react-native-safe-area-context'
import * as Yup from 'yup'
import { getColorOptions } from '../../../domain/services/getColorOptions'
import { ColorOption } from '../../../domain/models/ColorOption'
import { checkedButton, checkedCircle, circleInput } from '../../styles/styles'
import { createNote } from '../../../application/note/create/createNote'
import { useNotesRepository } from '../../../providers/NotesRepository/useNotesRepository'
import { useNotes } from '../../../providers/Notes/useNotes'
import { useNavigation } from '@react-navigation/native'
import { RootStackNavigationProp } from '../../../../../../type'
import { Header } from './_components/Header'
import { ColorPicker } from '../../../../../common/ColorPicker/ColorPicker'

interface FormValues {
  fileType: string
  color: FileColor
  fileName: string
}

type ItemProps = {
  colorOption: ColorOption
  fieldName: string
  setFieldValue: (
    field: string,
    value: any,
    shouldValidate?: boolean | undefined
  ) => Promise<void | FormikErrors<FormValues>>
}

enum FileType {
  NOTE = 'note',
  FOLDER = 'folder',
}

export const AddNote: React.FC = () => {
  const [selectedColor, setSelectedColor] =
    useState<FileColor>('pastelDarkPurple')
  const [colorOptions, setColorOptions] = useState<ColorOption[]>()

  const { notesRepository } = useNotesRepository()
  const navigation = useNavigation<RootStackNavigationProp>()
  const { loadNotes } = useNotes()

  useEffect(() => {
    const colorOptions = getColorOptions()
    setColorOptions(colorOptions)
  }, [])

  const handleColorChange = (color: FileColor) => {
    setSelectedColor(color)
  }

  const handleCreation = async (values: FormValues) => {
    const { fileType, color, fileName } = values
    if (fileType === FileType.NOTE) {
      const createdNote = await createNote(notesRepository, {
        title: fileName,
        content: '',
        color,
        createdAt: new Date().toISOString(),
        isFavorite: false,
      })

      loadNotes()
      navigation.navigate('EditNote', { noteId: createdNote.id })
    }
  }

  const initialValues: FormValues = {
    fileType: 'note',
    color: selectedColor,
    fileName: '',
  }

  const validationSchema = Yup.object().shape({
    fileType: Yup.string()
      .trim()
      .min(1, 'You have to choose a file type.')
      .required('You have to choose a file type.'),
    color: Yup.string()
      .trim()
      .min(1, 'You have to choose a color.')
      .required('You have to choose a color.'),
    fileName: Yup.string()
      .trim()
      .min(1, 'You have to name the file.')
      .required('You have to name the file.'),
  })

  type IconName = 'file' | 'folder-open'
  interface FileTypeButtonProps {
    iconName: IconName
    text: string
    value: string
    field: any
    selectedColor: FileColor
    setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void
  }

  const FileTypeButton: React.FC<FileTypeButtonProps> = ({
    iconName,
    text,
    value,
    field,
    selectedColor,
    setFieldValue,
  }) => (
    <Pressable onPress={() => setFieldValue(field.name, value)}>
      <Animated.View
        style={
          field.value === value ? checkedButton(selectedColor) : styles.button
        }
      >
        <Pressable
          style={styles.buttonContent}
          onPress={() => setFieldValue(field.name, value)}
        >
          <FontAwesome name={iconName} size={24} color="black" />
          <Texto estilo="montserratBold">{text}</Texto>
        </Pressable>
      </Animated.View>
    </Pressable>
  )

  return (
    <SafeAreaView>
      <KeyboardAvoidingView>
        <StatusBar style="auto" />
        <ScrollView>
          <Layout>
            <Header />
            <Formik
              initialValues={initialValues}
              onSubmit={handleCreation}
              validationSchema={validationSchema}
            >
              {({ errors, handleChange, setFieldValue, handleSubmit }) => (
                <>
                  <Texto estilo="montserratBold" marginBottom="medium">
                    ¿Qué deseas crear?
                  </Texto>
                  <Field name="fileType">
                    {({ field }: FieldProps<any>) => (
                      <View style={styles.buttonContainer}>
                        <FileTypeButton
                          iconName="file"
                          text="Una nota"
                          value="note"
                          field={field}
                          selectedColor={selectedColor}
                          setFieldValue={setFieldValue}
                        />
                        <FileTypeButton
                          iconName="folder-open"
                          text="Una carpeta"
                          value="folder"
                          field={field}
                          selectedColor={selectedColor}
                          setFieldValue={setFieldValue}
                        />
                      </View>
                    )}
                  </Field>

                  <Texto estilo="montserratBold" marginBottom="medium">
                    Elige un color para mostrarla
                  </Texto>
                  <Field name="color">
                    {({ field }: FieldProps<any>) => (
                      <ColorPicker
                        colorOptions={colorOptions || []}
                        initialColor={selectedColor}
                        onColorChange={handleColorChange}
                        fieldName={field.name}
                        setFieldValue={setFieldValue}
                      />
                    )}
                  </Field>

                  <Texto estilo="montserratBold" marginBottom="medium">
                    ¿Cómo la vas a llamar?
                  </Texto>
                  <Field name="fileName">
                    {({ field }: FieldProps<any>) => (
                      <View style={styles.nameContainer}>
                        <MaterialCommunityIcons
                          name="pencil"
                          size={18}
                          color="black"
                          style={styles.nameIcon}
                        />
                        <TextInput
                          style={styles.noteInput}
                          placeholder="Escribe aquí el nombre"
                          onChangeText={handleChange(field.name)}
                        />
                      </View>
                    )}
                  </Field>

                  <View style={styles.saveContainer}>
                    <Pressable
                      style={styles.saveButton}
                      android_ripple={{ color: theme.colors.white }}
                      onPress={() => {
                        handleSubmit()
                        console.log(errors)
                      }}
                    >
                      <Texto color="white">Crear</Texto>
                    </Pressable>
                  </View>
                </>
              )}
            </Formik>
          </Layout>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  buttonContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.large,
  },
  button: {
    backgroundColor: theme.colors.secondary,
    borderRadius: 10,
    height: 150,
    width: 150,
    padding: 30,
  },
  buttonContent: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: theme.spacing.xsmall,
    flexGrow: 1,
  },
  colorPickerContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: theme.spacing.small,
    minHeight: 60,
    paddingHorizontal: theme.spacing.xsmall,
    marginBottom: theme.spacing.large,
  },
  nameContainer: {
    backgroundColor: theme.colors.secondary,
    borderRadius: 10,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    flexGrow: 1,
    marginBottom: theme.spacing.large,
  },
  nameIcon: {
    paddingHorizontal: 15,
  },
  noteInput: {
    minHeight: 50,
    flexGrow: 1,
    fontFamily: theme.fonts.montserratRegular,
  },
  saveContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexGrow: 1,
  },
  saveButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
})
