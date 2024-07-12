import { getStorage, ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import app from './Firebase';
export const upload = async (image) => {
    if (image == null)
        return;
    const storage = getStorage(app);
    return new Promise((resolve, reject) => {
        const storageRef = ref(storage, `images/${image.name}`);
        uploadBytesResumable(storageRef, image)
          .then((snapshot) => {
            return getDownloadURL(snapshot.ref);
          })
          .then((downloadURL) => {
            resolve(downloadURL);
          })
          .catch((error) => {
            reject(error);
          });
      });


}