import React, { useState, useEffect } from "react";
import Header from "../../component/header";
import Sidebar from "../../component/sidebar";
import { useNavigate, useParams } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import swal from "sweetalert2";

function EditSiswa() {
  const navigate = useNavigate();
  const [kelas, setKelas] = useState([]);
  const { id } = useParams();
  const { URL_SISWA } = require("../../configapi");

  const [formData, setFormData] = useState({
    NISN: "",
    Nama_Depan: "",
    Nama_Belakang: "",
    Kelas: "",
    Agama: "",
    Email: "",
    Alamat: "",
    Jenis_Kelamin: "",
    Tanggal_Lahir: "",
    Password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    swal
      .fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, update it!",
      })
      .then(async (result) => {
        if (result.isConfirmed) {
          const data = new FormData();
          const fileField = document.querySelector('input[type="file"]');
          if (fileField.files.length > 0) {
            // If a new file was selected, add it to the form data
            data.append("file", fileField.files[0]);
          }
          // Add all form data to FormData
          Object.keys(formData).forEach((key) => {
            data.append(key, formData[key]);
          });

          console.log(data);

          const response = await fetch(`${URL_SISWA}api/siswa/${id}`, {
            method: "PUT",
            body: data,
          });

          const responseData = await response.json();
          if (responseData.ID) {
            setFormData({
              NISN: "",
              Nama_Depan: "",
              Nama_Belakang: "",
              Kelas: "",
              Agama: "",
              Email: "",
              Alamat: "",
              Jenis_Kelamin: "",
              Tanggal_Lahir: "",
              Password: "",
            });
            swal.fire("Updated!", "Your file has been updated.", "success");
            navigate("/all-siswa");
          } else if (responseData.message) {
            // Jika ada pesan kesalahan dari server, tampilkan dengan SweetAlert
            swal.fire({
              icon: "error",
              title: "Oops...",
              text: responseData.message,
            });
          }
        }
      });
  };

  useEffect(() => {
    const { URL_SISWA } = require("../../configapi");
    fetch(`${URL_SISWA}api/siswa/${id}`)
      .then((response) => response.json())
      .then((data) => {
        // Ensure the data structure is correct
        const studentData = {
          NISN: data.NISN,
          Nama_Depan: data.Nama_Depan,
          Nama_Belakang: data.Nama_Belakang,
          Kelas: data.kelas, // Set the Kelas field to the student's class id
          Agama: data.Agama,
          Email: data.Email,
          Alamat: data.Alamat,
          Jenis_Kelamin: data.Jenis_Kelamin,
          Tanggal_Lahir: data.Tanggal_Lahir,
          Password: data.Password,
        };
        setFormData(studentData);
      })
      .catch((error) => console.error(error));
  }, [id]);

  return (
    <div id="layout-wrapper">
      <Header />
      <Sidebar />
      <div className="main-content">
        <div className="page-content">
          <div className="container-fluid">
            <div className="row">
              <div className="col-xl-12">
                <div className="card">
                  <div className="card-body">
                    <h4 className="card-title">Edit Siswa</h4>
                    <p className="card-title-desc">
                      This form is used to update the details of a student in
                      the system. Please fill out all necessary fields and
                      ensure the information is accurate and up-to-date.
                    </p>
                    <form
                      className="needs-validation"
                      onSubmit={handleSubmit}
                      noValidate
                    >
                      <label htmlFor="Nama_Depan" className="form-label">
                        Nisn
                      </label>

                      <input
                        type="text"
                        name="NISN"
                        className="form-control"
                        placeholder="NISN"
                        value={formData.NISN}
                        onChange={handleChange}
                      />
                      <div className="row">
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label htmlFor="Nama_Depan" className="form-label">
                              Nama Depan
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              id="Nama_Depan"
                              name="Nama_Depan"
                              placeholder="First name"
                              value={formData.Nama_Depan}
                              onChange={handleChange}
                              required
                            />
                            <div className="valid-feedback"></div>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label
                              htmlFor="Nama_Belakang"
                              className="form-label"
                            >
                              Nama Belakang
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              id="Nama_Belakang"
                              name="Nama_Belakang"
                              placeholder="Last name"
                              value={formData.Nama_Belakang}
                              onChange={handleChange}
                              required
                            />
                            <div className="valid-feedback">Looks good!</div>
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-4">
                          <div className="mb-3">
                            <label
                              htmlFor="validationCustom03"
                              className="form-label"
                            >
                              Kelas
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              id="Kelas"
                              name="Kelas"
                              placeholder="Kelas"
                              value={formData.Kelas}
                              onChange={handleChange}
                              required
                            />
                            <div className="invalid-feedback">
                              Please select a valid state.
                            </div>
                          </div>
                        </div>

                        <div className="col-md-4">
                          <div className="mb-3">
                            <label
                              htmlFor="validationCustom04"
                              className="form-label"
                            >
                              Agama
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              name="Agama"
                              required
                              placeholder="Agama"
                              value={formData.Agama}
                              onChange={handleChange}
                            />
                            <div className="invalid-feedback">
                              Please provide a valid Religion
                            </div>
                          </div>
                        </div>
                        <div className="col-md-4">
                          <div className="mb-2">
                            <label
                              htmlFor="validationCustom05"
                              className="form-label"
                            >
                              Email
                            </label>
                            <input
                              type="email"
                              className="form-control"
                              id="validationCustom05"
                              name="Email"
                              placeholder="Email"
                              value={formData.Email}
                              onChange={handleChange}
                              required
                            />
                            <div className="invalid-feedback">
                              Please provide a valid email.
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-7">
                          <div className="mb-2">
                            <label>Alamat</label>
                            <input
                              type="text"
                              className="form-control"
                              name="Alamat"
                              required
                              placeholder="Alamat"
                              value={formData.Alamat}
                              onChange={handleChange}
                            />{" "}
                          </div>
                        </div>
                        <div className="col-md-5">
                          <div className="mb-3">
                            <label>Jenis Kelamin</label>
                            <select
                              className="form-select"
                              name="Jenis_Kelamin"
                              aria-label="Default select example"
                              value={formData.Jenis_Kelamin}
                              onChange={handleChange}
                            >
                              <option selected="">Pilih...</option>
                              <option value="Laki-Laki">Laki-laki</option>
                              <option value="Perempuan">Perempuan</option>
                              <option value="Lainnya">Lainnya</option>
                            </select>
                          </div>
                        </div>
                      </div>
                      <div className="mb-2">
                        <label>Tanggal Lahir</label>
                      </div>
                      <div className="row mb-3">
                        <div className="col-sm-10">
                          <input
                            className="form-control"
                            required
                            type="date"
                            name="Tanggal_Lahir"
                            value={formData.Tanggal_Lahir}
                            onChange={handleChange}
                            id="example-date-input"
                          />
                        </div>
                      </div>

                      <br></br>

                      <button className="btn btn-primary" type="submit">
                        Update Form{" "}
                        <i class="fas fa-edit align-middle ms-2"></i>
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditSiswa;
