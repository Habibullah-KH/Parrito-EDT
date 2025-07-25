export const imageUpload = async (imageFile) => {
const formData = new FormData();
formData.append("image", imageFile);

  const apiKey ='d7aa561c3241e9313bc80d4d5929f656';
  const url = `https://api.imgbb.com/1/upload?key=${apiKey}`;

  try{
    const response = await fetch(url, {
        method: "POST",
        body: formData,
    });
    const data = await response.json();
    return data?.data.url || null ;
  }
  catch(error){
    console.log("got the error")
    return null;
  }
}