import { FormEvent, useEffect, useState } from 'react';
import * as C from './app.styles'
import * as Photos from './services/photos'
import { Photo } from './types/photo';
import { PhotoItem } from './components/PhotoItem';

function App() {
  const [upload, setUpload] = useState(false)
  const [loading, setLoading] = useState(false);
  const [photos, setPhotos] = useState<Photo[]>([]); // Inicializado como um array vazio

  useEffect(() => {
    const getPhotos = async () => {
      setLoading(true);
      setPhotos(await Photos.getAll());
      setLoading(false);
    };

    getPhotos();
  }, []);

  const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const formData = new FormData(e.currentTarget)
    const file = formData.get('image') as File;

    if(file && file.size > 0) {
      setLoading(true)
      let result = await Photos.insert(file)
      setLoading(false)

      if(result instanceof Error) {
        alert(`${result.name} - ${result.message}`)
      } else {
        let newPhotoList = [...photos]
        newPhotoList.push(result)
        setPhotos(newPhotoList)
      }
    }
  }

  const handleDelPhoto = async (fileName: string) => {
    await Photos.del(fileName);
    setPhotos(photos.filter(photo => photo.name !== fileName));
  }

  return (
    <C.Container>
      <C.Area>
        <C.Header>Galeria de Fotos</C.Header>

        <C.UploadForm method="POST" onSubmit={handleFormSubmit}>
          <input type="file" name='image' />
          <input type="submit" value="Enviar" />
          {upload && "Enviando..."}
        </C.UploadForm>
        
        {loading &&
          <C.ScreenWarning>
            <div className="emoji">🤚</div>
            <div>Carregando...</div>
          </C.ScreenWarning>
        }

        {!loading && photos.length > 0 &&
          <C.PhotoList>
            {photos.map((item, index) => (
              <PhotoItem key={index} url={item.url} name={item.name} onClick={handleDelPhoto}/>
            ))}
          </C.PhotoList>
        }

        {!loading && photos.length === 0 &&
          <C.ScreenWarning>
            <div className="emoji">📂</div>
            <div>Não há fotos disponíveis.</div>
          </C.ScreenWarning>
        }
      </C.Area>
    </C.Container>
  );
}

export default App;