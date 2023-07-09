import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SearchBar from 'components/searchbar/SearchBar';
import ImageGallery from 'components/imagegallery/ImageGallery';
import Loader from 'components/loader/Loader';
import Button from 'components/button/Button';
import Modal from 'components/modal/Modal';
import css from './App.module.css';

const API_KEY = '36589394-2143494a5fc7170f91521e5d8';

const fetchImages = async (
  searchQuery,
  page,
  setImages,
  setPage,
  setIsLoading
) => {
  setIsLoading(true);

  try {
    const response = await axios.get(
      `https://pixabay.com/api/?q=${searchQuery}&page=${page}&key=${API_KEY}&image_type=photo&orientation=horizontal&per_page=12`
    );

    const newImages = response.data.hits.map(image => ({
      id: image.id,
      webformatURL: image.webformatURL,
      largeImageURL: image.largeImageURL,
    }));

    setImages(prevImages => [...prevImages, ...newImages]);
    setPage(prevPage => prevPage + 1);
  } catch (error) {
    console.log('Error:', error);
  }

  setIsLoading(false);
};

export const App = () => {
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);

  const handleSearchSubmit = query => {
    setImages([]);
    setSearchQuery(query);
    setPage(1);
  };

  const handleLoadMore = () => {
    fetchImages(searchQuery, page, setImages, setPage, setIsLoading);
  };

  const handleImageClick = imageUrl => {
    setSelectedImage(imageUrl);
  };

  const handleCloseModal = () => {
    setSelectedImage(null);
  };

  useEffect(() => {
    if (searchQuery === '') {
      return;
    }

    fetchImages(searchQuery, page, setImages, setPage, setIsLoading);
  }, [searchQuery, page]);

  return (
    <div className={css.App}>
      <SearchBar onSubmit={handleSearchSubmit} />

      <ImageGallery images={images} onImageClick={handleImageClick} />

      {isLoading && <Loader />}

      {images.length > 0 && !isLoading && <Button onClick={handleLoadMore} />}

      <Modal
        isOpen={selectedImage !== null}
        imageUrl={selectedImage}
        onClose={handleCloseModal}
      />
    </div>
  );
};
