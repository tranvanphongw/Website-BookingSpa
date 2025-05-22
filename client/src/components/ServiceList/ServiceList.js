// ServiceList.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './ServiceList.module.css';
import { Link } from 'react-router-dom';

const ServiceList = () => {
    const [services, setServices] = useState([]);
    const [categories, setCategories] = useState([]);
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('');

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/services', {
                    params: { search, category }
                });
                setServices(response.data);
            } catch (error) {
                console.error('Lỗi khi lấy dữ liệu dịch vụ:', error);
            }
        };
        fetchServices();
    }, [search, category]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/services/categories');
                setCategories(response.data);
            } catch (error) {
                console.error('Lỗi khi lấy dữ liệu loại dịch vụ:', error);
            }
        };
        fetchCategories();
    }, []);

    return (
        <div className={styles['service-list']}>
            <h1>DANH SÁCH DỊCH VỤ</h1>

            <div className={styles.filters}>
                <input
                    type="text"
                    placeholder="🔍 Tìm kiếm dịch vụ..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <select value={category} onChange={(e) => setCategory(e.target.value)}>
                    <option value="">Tất cả loại dịch vụ</option>
                    {categories.map((cat) => (
                        <option key={cat.MALOAI} value={cat.MALOAI}>
                            {cat.TENLOAI}
                        </option>
                    ))}
                </select>
            </div>

            <div className={styles.cardGrid}>
                {services.map((service) => (
                    <Link to={`/service-detail/${service.MADV}`} key={service.MADV} className={styles.cardLink}>
                        <div className={styles.card}>
                            {service.HINHANH && (
                                <img
                                    src={`http://localhost:5000/${service.HINHANH}`}
                                    alt={service.TEN}
                                    className={styles.cardImage}
                                />
                            )}
                            <div className={styles.cardContent}>
                                <h3>{service.TEN}</h3>
                                <p className={styles.description}>{service.MOTA}</p>
                                <p className={styles.price}>
                                    Giá: {service.GIATIEN.toLocaleString('vi-VN')} VND
                                </p>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default ServiceList;