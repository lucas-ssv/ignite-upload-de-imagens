import { Box, Button, Stack, useToast } from '@chakra-ui/react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { api } from '../../services/api';
import { FileInput } from '../Input/FileInput';
import { TextInput } from '../Input/TextInput';

interface FormAddImageProps {
  closeModal: () => void;
}

type CreateImageFormData = {
  image: FileList;
  title: string;
  description: string;
};

const schema = yup.object().shape({
  image: yup.mixed().required('Arquivo obrigatório'),
  title: yup
    .string()
    .min(2, 'Minímo de 2 caracteres')
    .max(20, 'Máximo de 20 caracteres')
    .required('Título obrigatório'),
  description: yup
    .string()
    .max(65, 'Máximo de 65 caracteres')
    .required('Descrição obrigatória'),
});

export function FormAddImage({ closeModal }: FormAddImageProps): JSX.Element {
  const [imageUrl, setImageUrl] = useState('');
  const [localImageUrl, setLocalImageUrl] = useState('');
  const toast = useToast();

  const formValidations = {
    image: {
      // TODO REQUIRED, LESS THAN 10 MB AND ACCEPTED FORMATS VALIDATIONS
      required: true,
      validate: {
        lessThan10MB: files => files[0]?.size < 10000000 || 'Max 10MB',
        acceptedFormats: files =>
          ['image/png', 'image/jpeg', 'image/gif'].includes(files[0]?.type) ||
          'Only PNG, JPEG and GIF',
      },
    },
    title: {
      // TODO REQUIRED, MIN AND MAX LENGTH VALIDATIONS
      required: true,
      minLength: 2,
      maxLength: 20,
    },
    description: {
      // TODO REQUIRED, MAX LENGTH VALIDATIONS
      required: true,
      maxLength: 65,
    },
  };

  const queryClient = useQueryClient();
  const mutation = useMutation(
    // TODO MUTATION API POST REQUEST,
    async (image: CreateImageFormData) => {
      const response = await api.post('api/images', {
        title: image.title,
        description: image.description,
        url: imageUrl,
      });

      console.log(response.data);

      return response.data;
    },
    {
      // TODO ONSUCCESS MUTATION
      onSuccess: () => {
        queryClient.invalidateQueries('images');
      },
    }
  );

  const { register, handleSubmit, reset, formState, setError, trigger } =
    useForm({
      resolver: yupResolver(schema),
    });
  const { errors } = formState;

  const onSubmit: SubmitHandler<CreateImageFormData> = async data => {
    console.log(data);
    try {
      // TODO SHOW ERROR TOAST IF IMAGE URL DOES NOT EXISTS
      if (!imageUrl) {
        toast({
          title: 'Imagem não adicionada',
          description:
            'É preciso adicionar e aguardar o upload de uma imagem antes de realizar o cadastro.',
          status: 'error',
        });
      }
      // TODO EXECUTE ASYNC MUTATION
      await mutation.mutateAsync(data);
      // TODO SHOW SUCCESS TOAST
      toast({
        title: 'Imagem cadastrada',
        description: 'Sua imagem foi cadastrada com sucesso',
        status: 'success',
      });
    } catch {
      // TODO SHOW ERROR TOAST IF SUBMIT FAILED
      toast({
        title: 'Falha no cadastro',
        description: 'Ocorreu um erro ao tentar cadastrar a sua imagem',
        status: 'error',
      });
    } finally {
      // TODO CLEAN FORM, STATES AND CLOSE MODAL
      reset({
        image: '',
        title: '',
        description: '',
      });
      setImageUrl('');
      setLocalImageUrl('');
      closeModal();
    }
  };

  return (
    <Box as="form" width="100%" onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={4}>
        <FileInput
          name="image"
          setImageUrl={setImageUrl}
          localImageUrl={localImageUrl}
          setLocalImageUrl={setLocalImageUrl}
          setError={setError}
          trigger={trigger}
          {...register('image', formValidations.image)}
          error={errors.image}
          // TODO SEND IMAGE ERRORS
          // TODO REGISTER IMAGE INPUT WITH VALIDATIONS
        />

        <TextInput
          name="title"
          placeholder="Título da imagem..."
          {...register('title', formValidations.title)}
          error={errors.title}
          // TODO SEND TITLE ERRORS
          // TODO REGISTER TITLE INPUT WITH VALIDATIONS
        />

        <TextInput
          name="description"
          placeholder="Descrição da imagem..."
          {...register('description', formValidations.description)}
          error={errors.description}
          // TODO SEND DESCRIPTION ERRORS
          // TODO REGISTER DESCRIPTION INPUT WITH VALIDATIONS
        />
      </Stack>

      <Button
        my={6}
        isLoading={formState.isSubmitting}
        isDisabled={formState.isSubmitting}
        type="submit"
        w="100%"
        py={6}
      >
        Enviar
      </Button>
    </Box>
  );
}
