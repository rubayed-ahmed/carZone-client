import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { FaTimes } from "react-icons/fa";
import { Link } from "react-router-dom";
// import ConfirmationModal from '../../Shared/ConfirmationModal/ConfirmationModal';
// import Loading from '../../Shared/Loading/Loading';

const MyProducts = () => {
  // const [deletingProduct, setDeletingProduct] = useState(null);

  const {
    data: products,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      try {
        const res = await fetch("http://localhost:5000/products");
        const data = await res.json();
        return data;
      } catch (error) {}
    },
  });

  const handleDeleteProduct = (product) => {
    fetch(`http://localhost:5000/products/${product._id}`, {
      method: "DELETE",
      headers: {
        authorization: `bearer ${localStorage.getItem("accessToken")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.deletedCount > 0) {
          refetch();
          toast.success(`Product ${product.name} deleted successfully`);
        }
      });
  };

  // if (isLoading) {
  //     return <Loading></Loading>
  // }

  return (
    <div>
      <h2 className="text-3xl mb-6">Products: {products?.length}</h2>
      <div className="overflow-x-auto">
        <table className="table w-11/12">
          <thead>
            <tr>
              <th></th>
              <th></th>
              <th>Product Name</th>
              <th>Price</th>
              <th>Paymnet</th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {products?.map((product, i) => (
              <tr key={product._id}>
                <th>{i + 1}</th>
                <th>
                  <div className="avatar">
                    <div className="w-16 rounded-full">
                      <img src="https://placeimg.com/192/192/people" alt="" />
                    </div>
                  </div>
                </th>
                <td>{product.name}</td>
                <td>{product.price}</td>
                <td>
                  {product.price && !product.paid && (
                    <Link to={`/dashboard/payment/${product._id}`}>
                      <button className="btn btn-primary text-white btn-sm">Pay</button>
                    </Link>
                  )}
                  {product.price && product.paid && (
                    <span className="text-blue-500">Paid</span>
                  )}
                </td>
                <td className="cursor-pointer">Advertise</td>
                <td>
                  <label
                    onClick={() => handleDeleteProduct(product)}
                    htmlFor="confirmation-modal"
                    className="btn btn-sm btn-error text-white"
                  >
                    <FaTimes />
                  </label>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* {
            deletingDoctor && <ConfirmationModal
                title={`Are you sure you want to delete?`}
                message={`If you delete ${deletingDoctor.name}. It cannot be undone.`}
                successAction = {handleDeleteDoctor}
                successButtonName="Delete"
                modalData = {deletingDoctor}
                closeModal = {closeModal}
            >
            </ConfirmationModal>
        } */}
    </div>
  );
};

export default MyProducts;
