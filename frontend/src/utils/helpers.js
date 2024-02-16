import axios from "axios";

export const uploadToCloudinary = async (file) => {
  const formData = new FormData();
  console.log("file", file);
  formData.append("file", file);
  formData.append("upload_preset", "duwpl68m");
  const res = await axios.post(
    "https://api.cloudinary.com/v1_1/dwznxzijq/image/upload",
    formData,
    {
      withCredentials: false,
    }
  );

  const url = res.data.url;

  return url;
};

export const uploadImgByURL = (e) => {
  console.log(e);
  const link = new Promise((resolve, reject) => {
    try {
      resolve(e);
    } catch (err) {
      reject(err);
    }
  });

  return link.then((url) => {
    return { success: 1, file: { url } };
  });
};

export const uploadImgByFile = async (e) => {
  const url = await uploadToCloudinary(e);
  const link = new Promise((resolve, reject) => {
    resolve(url);
  });

  return link.then((url) => {
    console.log(url, e);
    if (url) {
      return {
        success: 1,
        file: { url },
      };
    }
  });
};
