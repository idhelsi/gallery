import { Photo } from "../types/photo";
import { storage } from "../libs/firebase";
import { ref, listAll, getDownloadURL, uploadBytes, getStorage, deleteObject } from "firebase/storage";
import { v4 as createId } from "uuid";

export const getAll = async () => {
  let list: Photo[] = [];

  const imagesFolder = ref(storage, "images");
  const photoList = await listAll(imagesFolder);

  for (let i in photoList.items) {
    let photoUrl = await getDownloadURL(photoList.items[i]);

    list.push({
      name: photoList.items[i].name,
      url: photoUrl,
    });
  }

  return list;
};

export const insert = async (file: File) => {
  if (["image/jpeg", "image/jpg", "image/png"].includes(file.type)) {
    let randomName = createId();
    let newFile = ref(storage, `images/${randomName}`);

    let upload = await uploadBytes(newFile, file);
    let photoUrl = await getDownloadURL(upload.ref);

    return { name: upload.ref.name, url: photoUrl } as Photo;
  } else {
    return new Error("Tipo de arquivo não definido.");
  }
};

export const del = async (fileName: string) => {
  const storage = getStorage();

  // Create a reference to the file to delete
  const desertRef = ref(storage, `images/${fileName}`);

  // Delete the file
  deleteObject(desertRef)
    .then(() => {
      alert(`${fileName} excluído com sucesso!`);
    })
    .catch((error) => {
      console.error("Erro ao excluir arquivo:", error);
      alert("Erro ao excluir arquivo");
    });
};
