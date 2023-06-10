import React from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as Yup from "yup";
import { supabase } from "utils/supabase";

function MyForm({ departure_airport, arrival_airport, departure_time }) {
  const initialValues = {
    name: "",
    email: "",
    cnic: "",
    phoneNo: "",
    passportNo: "",
    nationality: "",
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    cnic: Yup.string().required("CNIC is required"),
    phoneNo: Yup.string().required("Phone number is required"),
    passportNo: Yup.string().required("Passport number is required"),
    nationality: Yup.string().required("Nationality is required"),
  });

  const handleSubmit = async (values, actions) => {
    try {
      await supabase.from("passengers").insert([
        {
          name: values.name,
          email: values.email,
          cnic: values.cnic,
          phone_number: values.phoneNo,
          passport_number: values.passportNo,
          nationality: values.nationality,
        },
      ]);

      toast.success("Booking confirmed!");
    } catch (err) {
      console.log(err);
      toast.error("Failed to confirm booking");
    } finally {
      actions.setSubmitting(false);
    }
  };

  return (
    <div className="flex w-full h-[100vh] items-center justify-center flex-col bg-white">
      <div className="shadow-lg rounded-2xl h-[60%] w-[70%] p-5 flex-row flex mt-7 bg-white">
        <div className="w-[100%] p-5">
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            <Form>
              <div className="flex flex-col gap-3">
                <div className="text-2xl font-semibold">User Details</div>
                <div className="w-[100%]">
                  <Field
                    name="name"
                    type="text"
                    className="focus:border-b-violet-500 border-t-0 border-l-0 border-r-0 border-b-gray border-b-2 focus:outline-none w-full p-2 text-lg text-slate-700 hover:border-b-slate-800"
                    placeholder="Name"
                  />
                  <ErrorMessage
                    name="name"
                    component="div"
                    className="text-red-500"
                  />
                </div>
                <div className="w-[100%]">
                  <Field
                    name="email"
                    type="email"
                    className="focus:border-b-violet-500 border-t-0 border-l-0 border-r-0 border-b-gray border-b-2 focus:outline-none w-full p-2 text-lg text-slate-700 hover:border-b-slate-800"
                    placeholder="Email"
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-red-500"
                  />
                </div>
                <div className="w-[100%]">
                  <Field
                    name="cnic"
                    type="text"
                    className="focus:border-b-violet-500 border-t-0 border-l-0 border-r-0 border-b-gray border-b-2 focus:outline-none w-full p-2 text-lg text-slate-700 hover:border-b-slate-800"
                    placeholder="CNIC"
                  />
                  <ErrorMessage
                    name="cnic"
                    component="div"
                    className="text-red-500"
                  />
                </div>
                <div className="w-[99%]">
                  <Field
                    name="phoneNo"
                    type="text"
                    className="focus:border-b-violet-500 border-t-0 border-l-0 border-r-0 border-b-gray border-b-2 focus:outline-none w-full p-2 text-lg text-slate-700 hover:border-b-slate-800"
                    placeholder="Number"
                  />
                  <ErrorMessage
                    name="phoneNo"
                    component="div"
                    className="text-red-500"
                  />
                </div>
                <div className="w-[99%]">
                  <Field
                    name="passportNo"
                    type="text"
                    className="focus:border-b-violet-500 border-t-0 border-l-0 border-r-0 border-b-gray border-b-2 focus:outline-none w-full p-2 text-lg text-slate-700 hover:border-b-slate-800"
                    placeholder="Passport Number"
                  />
                  <ErrorMessage
                    name="passportNo"
                    component="div"
                    className="text-red-500"
                  />
                </div>
                <div className="w-[99%]">
                  <Field
                    name="nationality"
                    type="text"
                    className="focus:border-b-violet-500 border-t-0 border-l-0 border-r-0 border-b-gray border-b-2 focus:outline-none w-full p-2 text-lg text-slate-700 hover:border-b-slate-800"
                    placeholder="Nationality"
                  />
                  <ErrorMessage
                    name="nationality"
                    component="div"
                    className="text-red-500"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="flex p-3 bg-orange-500 text-lg text-white font-semibold rounded-md w-[40%] items-center justify-center mt-10 hover:bg-orange-600"
              >
                Confirm Booking
              </button>
            </Form>
          </Formik>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

export default MyForm;
