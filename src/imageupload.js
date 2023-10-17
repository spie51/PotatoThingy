import { useState, useEffect } from "react";
import React from "react";
import {useDropzone} from 'react-dropzone';
import axios from "axios";


export const ImageUpload = () => {
  const [selectedFile, setSelectedFile] = useState();
  const [preview, setPreview] = useState();
  const [data, setData] = useState();
  const [image, setImage] = useState(false);
  const [isLoading, setIsloading] = useState(false);
  let confidence = 0;

  const {
    acceptedFiles,
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject
  } = useDropzone({
    maxFiles: 2,
    accept: {
      'image/*': ['.jpeg', '.png']
    }
  });


  const sendFile = async () => {
    if (image) {
      let formData = new FormData();
      formData.append("file", selectedFile);
      let res = await axios({
        method: "post",
        url: "http://127.0.0.1:5000/predict",
        data: formData,
      });
      console.log(res.status);
      if (res.status === 200) {
        console.log(res.data);
        setData(res.data);
      }
      setIsloading(false);
    }
  }

  const getDummyPredict = () => {
    console.log("in method")
    axios({
        method: "GET",
        url:"http://127.0.0.1:5000/dummypredict",
      })
      .then((response) => {
        const res =response.data
        console.log(res)
        setData(res)
      }).catch((error) => {
        if (error.response) {
          console.log(error.response)
          console.log(error.response.status)
        //   console.log(error.response.headers)
          }
      })}

      const getPredict = () => {
        console.log("in method")
        axios({
            method: "GET",
            url:"http://127.0.0.1:5000/dummypredict",
          })
          .then((response) => {
            const res =response.data
            console.log(res)
            setData(res)
          }).catch((error) => {
            if (error.response) {
              console.log(error.response)
              console.log(error.response.status)
            //   console.log(error.response.headers)
              }
          })}

  const clearData = () => {
    setData(null);
    setImage(false);
    setSelectedFile(null);
    setPreview(null);
  };

  useEffect(() => {
    if (!selectedFile) {
      setPreview(undefined);
      return;
    }
    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);
  }, [selectedFile]);

  useEffect(() => {
    if (!preview) {
      return;
    }
    setIsloading(true);
    sendFile();
  }, [preview]);

  useEffect(() => {
    if (!acceptedFiles || acceptedFiles.length === 0) {
        setSelectedFile(undefined);
        setImage(false);
        setData(undefined);
        return;
    }
    setSelectedFile(acceptedFiles[0]);
    setData(undefined);
    setImage(true);
  }, [acceptedFiles]);

//   const onSelectFile = (files) => {
//     if (!files || files.length === 0) {
//       setSelectedFile(undefined);
//       setImage(false);
//       setData(undefined);
//       return;
//     }
//     setSelectedFile(files[0]);
//     setData(undefined);
//     setImage(true);
//   };

//   if (data) {
//     confidence = (parseFloat(data.confidence)).toFixed(2);
//   }

  return (
    <div>
        <div {...getRootProps({ className: 'dropzone' })}>
        <input {...getInputProps()} />
        <p>Drag 'n' drop some files here, or click to select files</p>
        <em>(Only *.jpeg and *.png images will be accepted)</em>
      </div>
        <button onClick={getDummyPredict}>Dummy Test</button>
        {data && <>
        <p>{data.class + " " + data.confidence}</p>
        <button onClick={clearData}>Clear</button>
        </>}
    </div>
  );
};
