/* eslint-disable react/jsx-props-no-spreading */
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import styles from '../components/Books/BookItem/BookItem.module.css';

// eslint-disable-next-line import/prefer-default-export
export function displayStars(rating) {
  const stars = [];
  for (let i = 0; i < 5; i += 1) {
    stars.push(
      /* eslint-disable comma-dangle */
      <FontAwesomeIcon
        key={`star-${i}`}
        icon={faStar}
        className={i < Math.round(rating) ? styles.full : styles.empty}
      />
    );
  }
  return stars;
}

export function generateStarsInputs(rating, register, readOnly = false) {
  const stars = [];
  for (let i = 1; i < 6; i += 1) {
    const isFull = i <= Math.round(rating);
    const icon = (
      <FontAwesomeIcon
        icon={faStar}
        className={isFull ? styles.full : styles.empty}
      />
    );

    if (readOnly) {
      stars.push(<span key={`readonly-${i}`}>{icon}</span>);
    } else {
      stars.push(
        <label key={`input-${i}`} htmlFor={`rating${i}`}>
          {icon}
          <input type="radio" value={i} id={`rating${i}`} {...register('rating')} readOnly={readOnly} />
        </label>
      );
    }
  }
  return stars;
}
