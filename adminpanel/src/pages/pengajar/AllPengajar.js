import React, { useEffect, useState } from "react";
import Header from "../../component/header";
import Sidebar from "../../component/sidebar";
import Footer from "../../component/footer";
import jsPDF from "jspdf"; // Untuk PDF
import autoTable from "jspdf-autotable"; // Untuk tabel PDF
import * as XLSX from "xlsx"; // Untuk Excel
import ReactPaginate from "react-paginate"; // Import ReactPaginate
import { Link } from "react-router-dom";
import swal from "sweetalert2";

function AllPengajar() {
  const [pengajars, setPengajar] = useState([]);
  const [loading, setLoading] = useState(true);
  const { URL_PENGAJAR } = require("../../configapi");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [perPage] = useState(8); // Jumlah data per halaman

  const fetchData = () => {
    const offset = currentPage * perPage;
    fetch(`${URL_PENGAJAR}api/pengajar?_start=${offset}&_limit=${perPage}`)
      .then((response) => response.json())
      .then((data) => {
        setPengajar(data);
        setLoading(false);
      })
      .catch((error) => console.error(error));
  };
  fetchData();

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const deletePengajar = (id) => {
    swal
      .fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      })
      .then((result) => {
        if (result.isConfirmed) {
          fetch(`${URL_PENGAJAR}api/pengajar/${id}`, {
            method: "DELETE",
          })
            .then((response) => response.json())
            .then((data) => {
              // Refresh the data
              fetchData();
              swal.fire("Deleted!", "Your file has been deleted.", "success");
            })
            .catch((error) => console.error(error));
        }
      });
  };

  const filteredPengajars = Array.isArray(pengajars)
    ? pengajars.filter(
        (pengajar) =>
          pengajar.Nama_Depan.toLowerCase().includes(search.toLowerCase()) ||
          pengajar.Nama_Belakang.toLowerCase().includes(search.toLowerCase())
      )
    : [];
  const pageCount = Math.ceil(pengajars.length / perPage);

  const paginatedData = filteredPengajars.slice(
    currentPage * perPage,
    (currentPage + 1) * perPage
  );

  const copyData = () => {
    const dataToCopy = pengajars.map((pengajar) => ({
      NIP: pengajar.NIP,
      Nama_Depan: pengajar.Nama_Depan,
      Nama_Belakang: pengajar.Nama_Belakang,
      Bidang: pengajar.Bidang,
    }));
    navigator.clipboard.writeText(JSON.stringify(dataToCopy));
  };
  const downloadExcel = () => {
    const modifiedData = pengajars.map((pengajar, index) => ({
      ID: index + 1,
      NIP: pengajar.NIP,
      Nama: `${pengajar.Nama_Depan} ${pengajar.Nama_Belakang}`,
      Bidang: pengajar.Bidang,
    }));
    modifiedData.unshift({
      ID: "ID",
      NIP: "NIP",
      Nama: "Nama",
      Bidang: "Bidang",
    });
    modifiedData.push({
      ID: "",
      NIP: "",
      Nama: `Total Pengajar: ${pengajars.length}`,
      Bidang: "",
    });
    const ws = XLSX.utils.json_to_sheet(modifiedData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Pengajar");
    XLSX.writeFile(wb, "pengajar.xlsx");
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text("Daftar Pengajar SMA N 1 PARMAKSIAN", 10, 10);
    const modifiedData = pengajars.map((pengajar, index) => [
      index + 1,
      pengajar.NIP,
      `${pengajar.Nama_Depan} ${pengajar.Nama_Belakang}`,
      pengajar.Bidang,
    ]);
    modifiedData.push(["", "", `Total Pengajar: ${pengajars.length}`, ""]);
    autoTable(doc, {
      startY: 20,
      head: [["ID", "NIP", "Nama", "Bidang"]],
      body: modifiedData,
    });
    doc.save("pengajar.pdf");
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div id="layout-wrapper">
      <Header />
      <Sidebar />
      <div className="main-content">
        <div className="page-content">
          <div className="container-fluid">
            <div className="row">
              <div className="col-12">
                <div className="card">
                  <div className="card-body">
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <h4 className="card-title">Semua Pengajar</h4>
                    </div>
                    <br></br>
                    <p className="card-title-desc">
                      This page displays all teachers in a searchable and
                      paginated table. You can interact with the table to copy
                      the data, download it as Excel or PDF, and add or delete
                      teachers. The data is fetched from an external API and
                      updates dynamically.
                    </p>
                    <div
                      id="datatable-buttons_wrapper"
                      className="dataTables_wrapper dt-bootstrap4 no-footer"
                    >
                      <div className="row">
                        <div className="col-sm-12 col-md-6">
                          <div className="dt-buttons btn-group flex-wrap">
                            <button
                              className="btn btn-secondary buttons-copy buttons-html5"
                              tabIndex="0"
                              aria-controls="datatable-buttons"
                              type="button"
                              onClick={copyData}
                            >
                              <span>Copy</span>
                            </button>
                            <button
                              className="btn btn-secondary buttons-excel buttons-html5"
                              tabIndex="0"
                              aria-controls="datatable-buttons"
                              type="button"
                              onClick={downloadExcel}
                            >
                              <span>Excel</span>
                            </button>
                            <button
                              className="btn btn-secondary buttons-pdf buttons-html5"
                              tabIndex="0"
                              aria-controls="datatable-buttons"
                              type="button"
                              onClick={downloadPDF}
                            >
                              <span>PDF</span>
                            </button>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                marginLeft: "16px",
                              }}
                            >
                              <Link
                                to="/add-pengajar"
                                className="btn btn-primary waves-effect waves-light"
                              >
                                Add Guru{" "}
                                <i class=" fas fa-user-plus align-middle ms-2"></i>
                              </Link>
                            </div>
                          </div>
                        </div>
                        <div className="col-sm-12 col-md-6">
                          <div
                            id="datatable-buttons_filter"
                            className="dataTables_filter"
                          >
                            <label>
                              Search:
                              <input
                                type="search"
                                className="form-control form-control-sm"
                                placeholder=""
                                aria-controls="datatable-buttons"
                                onChange={handleSearchChange}
                              />
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>

                    <table
                      id="datatable-buttons"
                      className="table table-striped table-bordered dt-responsive nowrap dataTable no-footer dtr-inline"
                    >
                      <thead>
                        <tr role="row">
                          <th>NIP</th>
                          <th>Nama Depan</th>
                          <th>Nama Belakang</th>
                          <th>Bidang</th>
                          <th className="action-column">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedData.length > 0 ? (
                          paginatedData.map((pengajar) => (
                            <tr key={pengajar.ID}>
                              <td>{pengajar.NIP}</td>
                              <td>{pengajar.Nama_Depan}</td>
                              <td>{pengajar.Nama_Belakang}</td>
                              <td>{pengajar.Bidang}</td>
                              <td>
                                <Link
                                  to={`/edit-pengajar/${pengajar.ID}`}
                                  className="btn btn-warning"
                                  style={{ marginRight: "5px" }}
                                >
                                  {" "}
                                  <i class="far fa-edit align-middle "></i>
                                </Link>
                                <button
                                  className="btn btn-danger waves-effect waves-light"
                                  onClick={() => deletePengajar(pengajar.ID)}
                                >
                                  <i class=" fas fa-trash-alt align-middle "></i>
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="5">No data available</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                    <div className="row">
                      <div className="col-sm-12 col-md-5">
                        <div
                          className="dataTables_info"
                          id="datatable-buttons_info"
                          role="status"
                          aria-live="polite"
                        >
                          Showing {currentPage * perPage + 1} to{" "}
                          {Math.min(
                            (currentPage + 1) * perPage,
                            pengajars.length
                          )}{" "}
                          of {pengajars.length} entries
                        </div>
                      </div>
                      <div className="col-sm-12 col-md-7">
                        <div
                          className="dataTables_paginate paging_simple_numbers"
                          id="datatable-buttons_paginate"
                        >
                          <ReactPaginate
                            previousLabel={"previous"}
                            nextLabel={"next"}
                            breakLabel={"..."}
                            breakClassName={"break-me"}
                            pageCount={pageCount}
                            marginPagesDisplayed={2}
                            pageRangeDisplayed={8}
                            onPageChange={handlePageClick}
                            containerClassName={"pagination"}
                            subContainerClassName={"pages pagination"}
                            activeClassName={"active"}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default AllPengajar;
