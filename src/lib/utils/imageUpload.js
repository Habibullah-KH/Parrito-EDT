export const imageUpload = async (imageFile) => {
const formData = new FormData();
formData.append("image", imageFile);

  const apiKey =process.env.MONGODB_API;
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