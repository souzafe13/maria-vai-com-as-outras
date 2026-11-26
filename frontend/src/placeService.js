import { request } from './api';

export function listPlaces(token, status) {
  const path = status ? `/places?status=${status}` : '/places';
  return request(path, { token });
}

export function createPlace(token, place) {
  return request('/places', { method: 'POST', body: place, token });
}

export function updatePlace(token, id, place) {
  return request(`/places/${id}`, { method: 'PUT', body: place, token });
}

export function deletePlace(token, id) {
  return request(`/places/${id}`, { method: 'DELETE', token });
}
