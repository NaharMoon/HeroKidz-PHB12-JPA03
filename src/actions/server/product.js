"use server";

import { collections, dbConnect } from "@/lib/dbConnect";
import { ObjectId } from "mongodb";

// export const getProducts = async () => {
//   const products = await dbConnect(collections.PRODUCTS).find().toArray();
//   return products;
// };

export const getProducts = async () => {
  try {
    const products = await dbConnect(collections.PRODUCTS).find().toArray();
    return products;
  } catch (error) {
    console.log("DB error ignored during build");
    return [];
  }
};

// export const getSingleProduct = async (id) => {
//   if (id.length != 24) {
//     return {};
//   }
//   const query = { _id: new ObjectId(id) };

//   const product = await dbConnect(collections.PRODUCTS).findOne(query);

//   return { ...product, _id: product._id.toString() } || {};
// };

export const getSingleProduct = async (id) => {
  try {
    if (id.length !== 24) {
      return {};
    }

    const query = { _id: new ObjectId(id) };
    const product = await dbConnect(collections.PRODUCTS).findOne(query);

    return { ...product, _id: product._id.toString() } || {};
  } catch (error) {
    console.log("DB error ignored during build");
    return {};
  }
};