import React, { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import Select from "react-select";
import { State } from "country-state-city";

import {
  saveNewsEditor,
  purgeNews,
  newsTitleCheck,
  uploadNewsImage,
  getNewsById,
  updateNewsEditor,
  getGroups,
  getEventTypes,
} from "../../../../services/adminServices";

import { UserAuthState } from "../../../../context/user/userContext";
import { useIsMounted } from "../../../../utils/useIsMounted";
import { useToastDispatch } from "../../../../context/toast/toastContext";

import { NewsEventTypeId } from "../../../../utils/contants";

import GlobalAdminLayOut from "../../../../sharedComponents/hoc/globalAdminLayOut";
import DashboardHeaderComponent from "../../../../sharedComponents/dashboardHeader/dashboardHeaderComponent";
import { reactSelectCustomStyles } from "../../../../assets/js/react-select-custom-styles";

import "../platformAdmin.scss";

function NewsItemsEditor() {
  const userState = UserAuthState();
  const isMounted = useIsMounted();
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToastDispatch();

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    clearErrors,
    watch,
    formState: { errors },
  } = useForm({ mode: "onChange" });

  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState();

  const [states, setStates] = useState([]);
  const [groups, setGroups] = useState([]);
  const [eventTypeList, setEventTypeList] = useState([]);
  const [groupsValue, setGroupsValue] = useState(null);
  const [newsGroupMapping, setNewsGroupMapping] = useState([]);
  const [eventDateError, setEventDateError] = useState(false);

  const [selectedFile, setSelectedFile] = useState();
  const [preview, setPreview] = useState();
  const [uploadedFile, setUploaded] = useState();

  const urlPattern =
    /^((ftp|http|https):\/\/)?(www.)?(?!.*(ftp|http|https|www.))[a-zA-Z0-9_-]+(\.[a-zA-Z]+)+((\/)[\w#]+)*(\/\w+\?[a-zA-Z0-9_]+=\w+(&[a-zA-Z0-9_]+=\w+)*)?\/?$/i;
  const urlPattern2 =
    /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/i;

  useEffect(() => {
    setStates(State.getStatesOfCountry("US"));
    getAllGroups();

    getEventTypes()
      .then((res) => {
        // console.log(res)
        setEventTypeList(res.data.$values);
      })
      .catch((err) => {
        console.log(err);
      });

    if (id && isMounted()) {
      setEditMode(true);
      getNewsDetails();
    } else {
      setValue("typeId", NewsEventTypeId.InPersonEvent);
    }
    return () => {};
  }, [editMode]);

  const getNewsDetails = () => {
    getNewsById(id)
      .then((res) => {
        // console.log(res)
        patchData(res.data);
        setEditData(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const patchData = (data) => {
    setValue("title", data.title);
    setValue("isEvent", data.isEvent);
    setValue("eventLocation", data.eventLocation);
    setValue("eventDate", data.eventDate?.split("T")[0]);
    setValue("eventStartDate", data.eventStartDate?.split("T")[0]);
    setValue("eventEndDate", data.eventEndDate?.split("T")[0]);
    setValue("address", data.address);
    setValue("address2", data.address2);
    setValue("city", data.city);
    setValue("state", data.state);
    setValue("zipCode", data.zipCode);
    setValue("description", data.description);
    setValue("enableResponse", data.enableResponse);
    setValue("signupUrl", data.signupUrl);
    setValue("enableMoreInfo", data.enableMoreInfo);
    setValue("informationUrl", data.informationUrl);
    setValue("programId", data.programId);

    (async () => {
      try {
        let res = await getGroups(userState.user.organization.organizationId);
        let list = [];
        res.data.map((item) =>
          list.push({
            value: item.id,
            label: item.groupName,
            isActive: item.isActive,
          })
        );

        let arr = data.newsGroupMapping.$values;

        const result = list.filter((li) =>
          arr.some((ar) => li.value === ar.groupId)
        );
        setGroupsValue(result);

        let x = [];
        result.map((item) =>
          x.push({ groupId: item.value, isActive: item.isActive })
        );
        setNewsGroupMapping(x);
      } catch (error) {
        console.log(error);
      }
      setUploaded(data.imageUrl);
      setValue("imageUrl", data.imageUrl);
      setValue("eventTime", data.eventTime);
      setValue("typeId", data.typeId.toString());
      handleEventDateCheck(data.eventDate?.split("T")[0]);
    })();
  };

  const getAllGroups = () => {
    getGroups(userState.user?.organization.organizationId)
      .then((res) => {
        // console.log(res)
        let list = [];
        res.data.map((item) =>
          list.push({
            value: item.id,
            label: item.groupName,
            isActive: item.isActive,
          })
        );
        setGroups(list.filter((item) => item.isActive));
      })
      .catch((err) => {
        console.log(err.response);
      });
  };

  const hiddenFileInput = useRef(null);
  const handleClick = (event) => {
    hiddenFileInput.current.click();
  };

  // create a preview as a side effect, whenever selected file is changed
  useEffect(() => {
    // console.log(selectedFile)
    if (!selectedFile) {
      setPreview(undefined);
      return;
    }

    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);

    // free memory when ever this component is unmounted
    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  const onSelectFile = (e) => {
    if (e.target.files.length !== 0) {
      let fileTyeps = [
        "image/png",
        "image/gif",
        "image/jpeg",
        "image/jpg",
        "image/jpe",
        "image/bmp",
      ];

      let selectImageFileaType = e.target.files[0].type;

      let check = fileTyeps.includes(selectImageFileaType);

      if (check) {
        setSelectedFile(e.target.files[0]);
        setValue("imageUrl", e.target.files[0]);

        if (editMode) {
          uploadImage(id, e.target.files[0]);
        }
      } else {
        toast({ type: "error", text: "Selected file not supported" });
      }
    }
  };

  const titleCheck = async (value) => {
    if (
      (editMode && editData.title !== value && value) ||
      (!editMode && value)
    ) {
      newsTitleCheck(value)
        .then((res) => {
          console.log(res);
          if (isMounted()) {
            if (res.data) {
              setError("title", {
                type: "validate",
              });
            } else {
              clearErrors("title");
            }
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      clearErrors("title");
    }
  };

  const debounce = (func, delay) => {
    let debounceTimer;
    return function () {
      const context = this;
      const args = arguments;
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => func.apply(context, args), delay);
    };
  };

  const onOptimisedHandleChange = debounce(titleCheck, 500);

  const saveNewsItem = (data, type) => {
    if (errors?.name?.type === "validate") {
      setError("title", {
        type: "validate",
      });
      return;
    }

    if (errors?.eventDate?.type === "validate") {
      setError("eventDate", {
        type: "validate",
      });
      return;
    }
    if (errors?.eventStartDate?.type === "validate") {
      setError("eventStartDate", {
        type: "validate",
      });
      return;
    }
    if (errors?.eventEndDate?.type === "validate") {
      setError("eventEndDate", {
        type: "validate",
      });
      return;
    }

    let imageFile = data.imageUrl;

    data.newsGroupMapping = newsGroupMapping;
    type === "publish" ? (data.isPublished = true) : (data.isPublished = false);
    data.imageUrl = "";
    data.postUserId = userState.user.id;
    data.isActive = true;

    if (data.eventDate === "") {
      data.eventDate = null;
    }
    if (data.eventStartDate === "") {
      data.eventStartDate = null;
    }
    if (data.eventEndDate === "") {
      data.eventEndDate = null;
    }

    saveNewsEditor(data)
      .then((res) => {
        uploadImage(res.data.id, imageFile);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const updateNewsItem = (data, type) => {
    if (errors?.name?.type === "validate") {
      setError("title", {
        type: "validate",
      });
      return;
    }
    if (errors?.eventDate?.type === "validate") {
      setError("eventDate", {
        type: "validate",
      });
      return;
    }
    if (errors?.eventStartDate?.type === "validate") {
      setError("eventStartDate", {
        type: "validate",
      });
      return;
    }
    if (errors?.eventEndDate?.type === "validate") {
      setError("eventEndDate", {
        type: "validate",
      });
      return;
    }
    data.newsGroupMapping = newsGroupMapping;
    type === "publish" ? (data.isPublished = true) : (data.isPublished = false);
    data.postUserId = userState.user.id;
    data.isActive = true;

    console.log(data);

    if (data.eventDate === "" || undefined) {
      data.eventDate = null;
    }
    if (data.eventStartDate ==="" || undefined) {
      data.eventStartDate = null;
    }
    if (data.eventEndDate === "" || undefined) {
      data.eventEndDate = null;
    }

    updateNewsEditor(id, data)
      .then((res) => {
        navigate("/portal/admin/newsItems");
        toast({ type: "success", text: "News item updated successfully" });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const uploadImage = (id, file) => {
    let f = new FormData();
    f = new FormData();
    f.append("File", file);
    uploadNewsImage(id, f)
      .then((res) => {
        if (!editMode) {
          navigate("/portal/admin/newsItems");
          toast({ type: "success", text: "News item added successfully" });
        } else {
          setValue("imageUrl", res.data.imageUrl);
        }
      })
      .catch((err) => {
        console.log(err.response);
        toast({
          type: "error",
          text: "Image upload failed! Please try again.",
        });

        purgeNews(id)
          .then((res) => {
            console.log(res);
          })
          .catch((err) => {
            console.log(err);
          });

        // if (!editMode) {
        //   navigate(`/portal/admin/editNewsItem/${id}`);
        //   setEditMode(true);
        //   setSelectedFile()
        // }
      });
  };

  const selectGroups = (data) => {
    setGroupsValue(data);
    setValue("newsGroupMapping", data);
    let arr = [];
    data.map((item) =>
      arr.push({ groupId: item.value, isActive: item.isActive })
    );
    setNewsGroupMapping(arr);
  };

  const currentDate = (value) => {
    let date = new Date();
    const day = date.toLocaleString("default", { day: "2-digit" });
    const month = date.toLocaleString("default", { month: "2-digit" });
    const year = date.toLocaleString("default", { year: "numeric" });
    let currDate = year + "-" + month + "-" + day;
    return currDate;
  };

  const eventType = watch("typeId"); // 1  = In-Person Event // 2 = "Online Event" // 3 = "Non-Event"

  const handleEventDateCheck = (value) => {
    if (id && value) {
      let inpDate = value;
      let date = new Date();
      const day = date.toLocaleString("default", { day: "2-digit" });
      const month = date.toLocaleString("default", { month: "2-digit" });
      const year = date.toLocaleString("default", { year: "numeric" });
      let currDate = year + "-" + month + "-" + day;
      // setEventDateError(inpDate < currDate);
    }
  };

  useEffect(() => {
    if (eventType === NewsEventTypeId.NonEvent) {
      setValue("eventLocation", "");
      setValue("eventDate", "");
      setValue("eventTime", "");
      setValue("address", "");
      setValue("address2", "");
      setValue("city", "");
      setValue("state", "");
      setValue("zipCode", "");
      // setEventDateError(false)
    }

    if (eventType === NewsEventTypeId.OnlineEvent) {
      setValue("address", "");
      setValue("address2", "");
      setValue("city", "");
      setValue("state", "");
      setValue("zipCode", "");
      if (editMode && editData) {
        setValue("eventLocation", editData.eventLocation);
        setValue("eventDate", editData.eventDate?.split("T")[0]);
        setValue("eventTime", editData.eventTime);
      }
    }

    if (eventType === NewsEventTypeId.InPersonEvent && editMode && editData) {
      setValue("eventLocation", editData.eventLocation);
      setValue("eventDate", editData.eventDate?.split("T")[0]);
      setValue("address", editData.address);
      setValue("address2", editData.address2);
      setValue("city", editData.city);
      setValue("state", editData.state);
      setValue("zipCode", editData.zipCode);
      setValue("eventTime", editData.eventTime);
    }
  }, [eventType]);

  const startDateWatch = watch("eventStartDate");
  const endDateWatch = watch("eventEndDate");
  const eventDateWatch = watch("eventDate");

  useEffect(() => {
    if (startDateWatch < endDateWatch) {
      clearErrors("eventStartDate");
    }
    if (
      eventDateWatch &&
      startDateWatch &&
      endDateWatch &&
      eventDateWatch > startDateWatch &&
      eventDateWatch < endDateWatch
    ) {
      clearErrors("eventDate");
    }
    if (eventDateWatch && startDateWatch && eventDateWatch > startDateWatch) {
      clearErrors("eventDate");
    }
    if (eventDateWatch && endDateWatch && eventDateWatch < endDateWatch) {
      clearErrors("eventDate");
    }
  }, [startDateWatch, endDateWatch, eventDateWatch]);

  const enableResponseWatch = watch("enableResponse");
  const enableMoreInfoWatch = watch("enableMoreInfo");

  useEffect(() => {
    if (!enableResponseWatch) {
      setValue("signupUrl", "");
    } else {
      if (editMode) {
        setValue("signupUrl", editData?.signupUrl);
      }
    }

    if (!enableMoreInfoWatch) {
      setValue("informationUrl", "");
    } else {
      if (editMode) {
        setValue("informationUrl", editData?.informationUrl);
      }
    }
  }, [enableResponseWatch, enableMoreInfoWatch]);

  const handleChange = (evt) => {
    const zip = evt.target.value;
    if (zip.length >= 6) {
      let x = `${zip.slice(0, 5)}`;
      setValue("zipCode", x);
      return;
    }
  };

  return (
    <>
      <div id="main" className="news-items-main">
        <DashboardHeaderComponent headerText="ReadySkill Administrator" />
        <div className="bread-crumb-assesment">
          <NavLink
            to="/portal/admin/platform_admins"
            className="smallText text-uppercase text-decoration-none navlink"
          >
            READYSKILL ADMINISTRATOR {">"}
          </NavLink>
          <NavLink
            to="/portal/admin/newsItems"
            className="smallText text-uppercase text-decoration-none navlink"
          >
            NEWS ITEMS{" "}
          </NavLink>
          <a className="smallText text-uppercase navlink-assesment text-decoration-none">
            {" "}
            {">"} News Item
          </a>
        </div>
        <div className="container-fluid">
          <h1 className="h5 headText mt-5 d-flex mb-3">
            <span className="material-icons mt-02 mr-2">feed</span>
            News Items Editor
          </h1>
        </div>
        <div className="container-fluid">
          <div className="row">
            <div className="col-xl-11 col-lg-12 col-md-12 col-sm-12 col-xs-12 mb-5 pr-2">
              <div className="card shadow group-manage-card pt-3">
                <div className="card-body px-5">
                  <div className="d-flex">
                    <p className="h5 text-white text-nowrap">
                      {editMode ? "Edit" : "Add"} News Item
                    </p>
                    <div className="text-right w-100 mb-3 mr-4">
                      <a
                        className="cancel-btn-text"
                        onClick={() => navigate("/portal/admin/newsItems")}
                      >
                        Cancel
                      </a>
                      {editMode ? (
                        <>
                          <button
                            type="button"
                            onClick={handleSubmit((data) =>
                              updateNewsItem(data, "draft")
                            )}
                            className="secondary-save-btn ml-3"
                          >
                            UPDATE AS DRAFT
                          </button>
                          <button
                            type="button"
                            onClick={handleSubmit((data) =>
                              updateNewsItem(data, "publish")
                            )}
                            className="primary-save-btn ml-3"
                          >
                            UPDATE AND PUBLISH
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            type="button"
                            onClick={handleSubmit((data) =>
                              saveNewsItem(data, "draft")
                            )}
                            className="secondary-save-btn ml-3"
                          >
                            SAVE DRAFT
                          </button>
                          <button
                            type="button"
                            onClick={handleSubmit((data) =>
                              saveNewsItem(data, "publish")
                            )}
                            className="primary-save-btn ml-3"
                          >
                            PUBLISH
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-4 hero-img-main">
                      <p className="subHead-text mb-0 pb-1">News Item Title</p>
                      <input
                        {...register("title", {
                          required: true,
                          onChange: (e) =>
                            onOptimisedHandleChange(e.target.value),
                        })}
                        name="title"
                        placeholder="Replace with the title of the news item"
                        className="custom-input cursor-text w-100 mt-0"
                      />
                      {errors.title?.type === "required" ? (
                        <span className="error-msg">Title required</span>
                      ) : errors.title?.type === "validate" ? (
                        <span className="error-msg">Title already exists</span>
                      ) : (
                        ""
                      )}
                      <div className="text-center hero-img-section ">
                        <div className="w-100 hero-image-wrapper mt-3">
                          {preview ? (
                            <img
                              src={preview}
                              key={preview}
                              alt="Profile"
                              width="230"
                              height="230"
                              onClick={handleClick}
                              className="hero-img"
                            />
                          ) : uploadedFile ? (
                            <img
                              src={uploadedFile}
                              key={uploadedFile}
                              alt="Profile"
                              width="230"
                              height="230"
                              onClick={handleClick}
                              className="hero-img"
                            />
                          ) : (
                            <div className="">
                              {/* <span className="material-icons missing-img cursor-pointer mb-2 mr-0" onClick={handleClick}>add_photo_alternate</span> */}
                              <p
                                className="text-5 cursor-pointer m-5 py-5"
                                onClick={handleClick}
                              >
                                Click Here to Upload Image
                              </p>
                            </div>
                          )}

                          {editMode || preview ? (
                            <div className="hero-img-edit">
                              <span
                                onClick={handleClick}
                                className="material-icons text-white  mt-2 mr-3 h5 pb-auto edit-hero-img cursor-pointer"
                              >
                                edit
                              </span>
                            </div>
                          ) : (
                            ""
                          )}
                        </div>
                        <input
                          {...register("imageUrl", {
                            required: true,
                            onChange: (e) => {
                              onSelectFile(e);
                            },
                          })}
                          type="file"
                          accept="image/png, image/gif, image/jpeg, image/jpg, image/jpe, image/bmp"
                          ref={hiddenFileInput}
                          style={{ display: "none" }}
                        />
                      </div>

                      {errors.imageUrl?.type === "required" ? (
                        <span className="error-msg">Select image</span>
                      ) : (
                        ""
                      )}

                      <div className="mt-3">
                        <p className="subHead-text mb-0 pb-1">News Item Text</p>
                        <textarea
                          type="text"
                          id="description"
                          placeholder="Description"
                          {...register("description")}
                          className="form-control mb-3 mr-1"
                          rows={15}
                        />
                      </div>
                    </div>
                    <div className="col-8">
                      <div className="mb-3 mt-4">
                        <div className="d-flex pt-1">
                          {eventTypeList.map((event) => (
                            <div key={event.$id}>
                              <input
                                {...register("typeId")}
                                name="typeId"
                                value={event.id}
                                id={event.id}
                                type="radio"
                              />
                              <label
                                htmlFor={event.id}
                                className="radio mr-3 inner-sub"
                              >
                                {event.name}
                              </label>
                            </div>
                          ))}
                        </div>

                        <div className="d-flex mb-3 mt-3">
                          <div className="col-7 pl-0">
                            <p className="mb-0 pb-1 subHead-text">
                              Event Location Name
                            </p>
                            <input
                              {...register("eventLocation")}
                              disabled={eventType === NewsEventTypeId.NonEvent}
                              name="eventLocation"
                              className="custom-input cursor-text w-100 mt-0"
                              placeholder="Please add description"
                            />
                          </div>
                          <div className="col-5 pl-0">
                            <p className="mb-0 pb-1 subHead-text">Event Date</p>
                            <input
                              type="date"
                              {...register("eventDate", {
                                validate: (value) =>
                                  value && startDateWatch && endDateWatch
                                    ? value > startDateWatch &&
                                      value < endDateWatch
                                    : value && startDateWatch
                                    ? value > startDateWatch
                                    : value && endDateWatch
                                    ? value < endDateWatch
                                    : true,
                              })}
                              disabled={eventType === NewsEventTypeId.NonEvent}
                              name="eventDate"
                              className="custom-input cursor-text w-100 mt-0"
                            />
                            {errors.eventDate?.type === "validate" ? (
                              <span className="error-msg">
                                Event date should be between than Start date and
                                End date
                              </span>
                            ) : (
                              ""
                            )}
                          </div>
                        </div>

                        <div className="d-flex mb-3">
                          <div className="col-6 pl-0">
                            <p className="mb-0 pb-1 subHead-text">Start Date</p>
                            <input
                              type="date"
                              {...register("eventStartDate", {
                                validate: (value) =>
                                  value && endDateWatch
                                    ? value < endDateWatch
                                    : true,
                              })}
                              name="eventStartDate"
                              className="custom-input cursor-text w-100 mt-0"
                            />
                            {errors.eventStartDate?.type === "validate" ? (
                              <span className="error-msg">
                                Event start date should be less than Event end
                                date
                              </span>
                            ) : (
                              ""
                            )}
                          </div>

                          <div className="col-6 pl-0">
                            <p className="mb-0 pb-1 subHead-text">End Date</p>
                            <input
                              type="date"
                              {...register("eventEndDate", {
                                validate: (value) =>
                                  value ? value > currentDate(value) : true,
                              })}
                              name="eventEndDate"
                              className="custom-input cursor-text w-100 mt-0"
                            />
                            {errors.eventEndDate?.type === "validate" ? (
                              <span className="error-msg">
                                Event end date should be greater than Current
                                Date
                              </span>
                            ) : (
                              ""
                            )}
                          </div>
                        </div>

                        <div className="mb-3">
                          <div className="col-12 pl-0">
                            <div className="d-flex w-90">
                              <p className="subHead-text mb-0 pb-1">Address</p>
                            </div>
                            <input
                              {...register("address")}
                              disabled={
                                eventType === NewsEventTypeId.NonEvent ||
                                eventType === NewsEventTypeId.OnlineEvent
                              }
                              name="address"
                              placeholder="Street Address"
                              className="custom-input cursor-text w-100 mt-0 mb-3"
                            />
                            <input
                              {...register("address2")}
                              disabled={
                                eventType === NewsEventTypeId.NonEvent ||
                                eventType === NewsEventTypeId.OnlineEvent
                              }
                              name="address2"
                              placeholder="Address Line 2"
                              className="custom-input cursor-text w-100 mt-0 mb-3"
                            />
                            <div className="d-flex w-100">
                              <div className="col-5 pl-0">
                                <input
                                  {...register("city")}
                                  disabled={
                                    eventType === NewsEventTypeId.NonEvent ||
                                    eventType === NewsEventTypeId.OnlineEvent
                                  }
                                  name="city"
                                  placeholder="City"
                                  className="custom-input cursor-text w-100 mt-0 mb-3"
                                />
                              </div>
                              <div className="col-4 state-select pl-0">
                                <span className="d-flex">
                                  <select
                                    {...register("state")}
                                    disabled={
                                      eventType === NewsEventTypeId.NonEvent ||
                                      eventType === NewsEventTypeId.OnlineEvent
                                    }
                                    placeholder="Status"
                                    id="state"
                                    defaultValue=""
                                    className=" form-control  text-capitalize caseworker-select select-box mb-3"
                                  >
                                    <option
                                      value=""
                                      className="caseworker-droplist text-capitalize default-value"
                                    >
                                      State
                                    </option>
                                    {states.map((state, index) => (
                                      <option
                                        key={index}
                                        value={state.isoCode}
                                        className="caseworker-droplist text-capitalize w-100"
                                      >
                                        {state.name}
                                      </option>
                                    ))}
                                  </select>
                                </span>
                              </div>
                              <div className="col-3 px-0  mb-3">
                                <span className="zip-input">
                                  <input
                                    maxLength={5}
                                    pattern="[0-9]*"
                                    onInput={(event) => handleChange(event)}
                                    {...register("zipCode", {
                                      pattern: /^([0-9]{5}$)/,
                                    })}
                                    onKeyDown={(evt) =>
                                      ["e", "E", "+", "-", "."].includes(
                                        evt.key
                                      ) && evt.preventDefault()
                                    }
                                    disabled={
                                      eventType === NewsEventTypeId.NonEvent ||
                                      eventType === NewsEventTypeId.OnlineEvent
                                    }
                                    type="number"
                                    name="zipCode"
                                    placeholder="ZIP"
                                    className="custom-input cursor-text w-100 mt-0"
                                  />
                                </span>
                                {errors.zipCode?.type === "pattern" ? (
                                  <span className="error-msg">
                                    Invalid zip code
                                  </span>
                                ) : (
                                  ""
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="col-12 d-flex px-0">
                            <div className="col-6 pl-0">
                              <p className="subHead-text mb-0 pb-1">
                                Event Times
                              </p>
                              <textarea
                                placeholder={
                                  "Example \nM-F 9:00 AM to 6:30 PM \nSa-Su 8:00 AM to 4:30 PM"
                                }
                                {...register("eventTime")}
                                disabled={
                                  eventType === NewsEventTypeId.NonEvent
                                }
                                rows={3}
                                name="eventTime"
                                className="custom-input cursor-text w-100 mt-0"
                              />
                            </div>
                            <div className="col-6 groups-select">
                              <p className="subHead-text mb-0 pb-1">
                                Display to groups
                              </p>
                              <Select
                                isMulti
                                {...register("newsGroupMapping")}
                                value={groupsValue}
                                onChange={selectGroups}
                                options={groups}
                                className="basic-multi-select "
                                classNamePrefix="select"
                                styles={reactSelectCustomStyles}
                                placeholder="Type here to search..."
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-12 pl-0">
                        <p className="subHead-text mb-0 pb-1">Links</p>
                        <div className="">
                          <div className="pl-0">
                            <div className="form-check ml-auto my-1">
                              <label className="custom-control overflow-checkbox">
                                <input
                                  type="checkbox"
                                  {...register("enableResponse")}
                                  name="enableResponse"
                                  id="enableResponse"
                                  className="form-check-input overflow-control-input"
                                />
                                <span className="overflow-control-indicator"></span>
                              </label>
                              <label
                                className="form-check-label inner-sub text-nowrap"
                                htmlFor="enableResponse"
                              >
                                Enable Response
                              </label>
                            </div>
                          </div>
                          <div className="w-75 pr-0  mb-3">
                            <input
                              disabled={!enableResponseWatch}
                              {...register("signupUrl", {
                                required: enableResponseWatch,
                                pattern: { value: urlPattern2 },
                              })}
                              name="signupUrl"
                              placeholder="Please add URL"
                              className="custom-input cursor-text w-100 mt-0"
                            />
                            {errors.signupUrl?.type === "required" &&
                            enableResponseWatch ? (
                              <span className="error-msg">
                                Response URL required
                              </span>
                            ) : errors.signupUrl?.type === "pattern" ? (
                              <span className="error-msg">Enter valid url</span>
                            ) : (
                              ""
                            )}
                          </div>
                        </div>

                        <div className="">
                          <div className="pl-0">
                            <div className="form-check ml-auto my-1">
                              <label className="custom-control overflow-checkbox">
                                <input
                                  type="checkbox"
                                  {...register("enableMoreInfo")}
                                  name="enableMoreInfo"
                                  id="enableMoreInfo"
                                  className="form-check-input overflow-control-input"
                                />
                                <span className="overflow-control-indicator"></span>
                              </label>
                              <label
                                className="form-check-label inner-sub text-nowrap"
                                htmlFor="enableMoreInfo"
                              >
                                Enable More Info Link
                              </label>
                            </div>
                          </div>
                          <div className="w-75 pr-0  mb-3">
                            <input
                              disabled={!enableMoreInfoWatch}
                              {...register("informationUrl", {
                                required: enableMoreInfoWatch,
                                pattern: { value: urlPattern2 },
                              })}
                              name="informationUrl"
                              placeholder="Please add URL"
                              className="custom-input cursor-text w-100 mt-0"
                            />
                            {errors.informationUrl?.type === "required" &&
                            enableMoreInfoWatch ? (
                              <span className="error-msg">
                                {" "}
                                Information URL required
                              </span>
                            ) : errors.informationUrl?.type === "pattern" ? (
                              <span className="error-msg">Enter valid url</span>
                            ) : (
                              ""
                            )}
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
      </div>
    </>
  );
}

export default GlobalAdminLayOut(NewsItemsEditor);
