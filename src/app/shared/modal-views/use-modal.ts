"use client";

import { atom, useAtomValue, useSetAtom } from "jotai";
import { ModalSize } from "rizzui";

type ModalTypes = {
  view: React.ReactNode;
  isOpen: boolean;
  customSize?: string;
  size?: ModalSize;
};

// Store a stack of modals instead of a single modal
const modalAtom = atom<ModalTypes[]>([]);

export function useModal() {
  const modals = useAtomValue(modalAtom);
  const setModals = useSetAtom(modalAtom);

  const openModal = ({
    view,
    customSize,
    size,
  }: {
    view: React.ReactNode;
    customSize?: string;
    size?: ModalSize;
  }) => {
    setModals((prev) => [
      ...prev,
      {
        isOpen: true,
        view,
        customSize: customSize,
        size: size,
      },
    ]);
  };

  const closeModal = () => {
    setModals((prev) => prev.slice(0, -1)); 
  };

  // Return the topmost modal's state (if any) along with the control functions
  const topModal = modals[modals.length - 1] || {
    isOpen: false,
    view: null,
    customSize: "320px",
    size: "sm" as ModalSize,
  };

  return {
    ...topModal,
    modals,
    openModal,
    closeModal,
  };
}


// 'use client';

// import { atom, useAtomValue, useSetAtom } from 'jotai';
// import { ModalSize } from 'rizzui';

// type ModalTypes = {
//   view: React.ReactNode;
//   isOpen: boolean;
//   customSize?: string;
//   size?: ModalSize;
// };

// const modalAtom = atom<ModalTypes>({
//   isOpen: false,
//   view: null,
//   customSize: '320px',
//   size: 'sm',
// });

// export function useModal() {
//   const state = useAtomValue(modalAtom);
//   const setState = useSetAtom(modalAtom);

//   const openModal = ({
//     view,
//     customSize,
//     size,
//   }: {
//     view: React.ReactNode;
//     customSize?: string;
//     size?: ModalSize;
//   }) => {
//     setState({
//       ...state,
//       isOpen: true,
//       view,
//       customSize,
//       size,
//     });
//   };

//   const closeModal = () => {
//     setState({
//       ...state,
//       isOpen: false,
//     });
//   };

//   return {
//     ...state,
//     openModal,
//     closeModal,
//   };
// }


