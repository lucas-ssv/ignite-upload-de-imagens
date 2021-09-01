import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalFooter,
  ModalBody,
  Image,
  Link as ChakraLink,
} from '@chakra-ui/react';

interface ModalViewImageProps {
  isOpen: boolean;
  onClose: () => void;
  imgUrl: string;
}

export function ModalViewImage({
  isOpen,
  onClose,
  imgUrl,
}: ModalViewImageProps): JSX.Element {
  // TODO MODAL WITH IMAGE AND EXTERNAL LINK
  return (
    <Modal size="3xl" onClose={onClose} isOpen={isOpen}>
      <ModalOverlay opacity={0.5} />
      <ModalContent bg="pGray.800">
        <ModalBody p={0}>
          <Image src={imgUrl} alt={imgUrl} overflow="hidden" />
          <ModalFooter display="flex" justifyContent="flex-start" p={2}>
            <ChakraLink
              href={`${imgUrl}`}
              color="pGray.50"
              fontSize={14}
              textDecoration="none !important"
            >
              Abrir original
            </ChakraLink>
          </ModalFooter>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
