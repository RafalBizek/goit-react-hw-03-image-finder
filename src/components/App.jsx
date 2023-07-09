import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SearchBar from 'components/searchbar/SearchBar';
import ImageGallery from 'components/imagegallery/ImageGallery';
import Loader from 'components/loader/Loader';
import Button from 'components/button/Button';
import Modal from 'components/modal/Modal';
import css from './App.module.css';

const API_KEY = '36589394-2143494a5fc7170f91521e5d8';
const PER_PAGE = 12;

const fetchImages = async (
  searchQuery,
  page,
  perPage,
  setImages,
  setTotalImagesCount,
  setDisplayedImagesCount,
  setIsLoading
) => {
  setIsLoading(true);

  try {
    const response = await axios.get(
      `https://pixabay.com/api/?q=${searchQuery}&key=${API_KEY}&image_type=photo&orientation=horizontal&per_page=${perPage}&page=${page}&min_width=640&min_height=480`
    );

    const newImages = response.data.hits.map(image => ({
      id: image.id,
      webformatURL: image.webformatURL,
      largeImageURL: image.largeImageURL,
    }));

    setImages(prevImages => [...prevImages, ...newImages]);
    setTotalImagesCount(response.data.totalHits);
    setDisplayedImagesCount(prevCount => prevCount + newImages.length);
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
  const [totalImagesCount, setTotalImagesCount] = useState(0);
  const [displayedImagesCount, setDisplayedImagesCount] = useState(0);

  const handleSearchSubmit = query => {
    setImages([]);
    setSearchQuery(query);
    setPage(1);
    setTotalImagesCount(0);
    setDisplayedImagesCount(0);
  };

  const handleLoadMore = () => {
    fetchImages(
      searchQuery,
      page + 1,
      PER_PAGE,
      setImages,
      setTotalImagesCount,
      setDisplayedImagesCount,
      setIsLoading
    );
    setPage(prevPage => prevPage + 1);
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

    fetchImages(
      searchQuery,
      page,
      PER_PAGE,
      setImages,
      setTotalImagesCount,
      setDisplayedImagesCount,
      setIsLoading
    );
  }, [searchQuery, page]);

  return (
    <div className={css.App}>
      <SearchBar onSubmit={handleSearchSubmit} />

      <ImageGallery images={images} onImageClick={handleImageClick} />

      {isLoading && <Loader />}

      {displayedImagesCount < totalImagesCount && !isLoading && (
        <Button onClick={handleLoadMore} />
      )}

      <Modal
        isOpen={selectedImage !== null}
        imageUrl={selectedImage}
        onClose={handleCloseModal}
      />
    </div>
  );
};
