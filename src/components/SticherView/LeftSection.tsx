import { AiFillDelete } from "react-icons/ai";
import { BASE_URL } from "../constants";
// import { IResponse } from "../types";
import useSticherStore from "../../store/sticherStore";
import { useState } from "react";

// interface LeftSectionProps {
//   fileMetaData: IResponse;
//   loading: boolean;
//   setActiveImageIndex: React.Dispatch<React.SetStateAction<number>>;
//   activeImageIndex: number;
//   handleDeleteImage: (
//     filePath: string
//   ) => (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => Promise<void>;
// }

const TextArea = ({
  text,
  editSlideText,
  id,
}: {
  text: string;
  id: string;
  editSlideText: (id: string, text: string) => void;
}) => {
  const [textValue, setTextValue] = useState(text);

  return (
    <textarea
      className="h-[58px] outline-1 outline-transparent border-none shadow-none focus:outline-gray-400 mt-1 text-sm p-1"
      value={textValue}
      onChange={(e) => setTextValue(e.target.value)}
      onBlur={() => editSlideText(id, textValue)}
    ></textarea>
  );
};

const LeftSection: React.FC = () => {
  const slideData = useSticherStore((state) => state.slideData);
  const activeImageIndex = useSticherStore((state) => state.activeImageIndex);
  const setActiveImageIndex = useSticherStore(
    (state) => state.setActiveImageIndex
  );
  const editSlideText = useSticherStore((state) => state.editSlideText);

  // const handleDeleteImage =
  // (filePath: string) =>
  // async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
  //   try {
  //     e.stopPropagation();
  //     setLoading(true);
  //     await axios.delete(`${BASE_URL}/api/files/${response?.fileId}`, {
  //       data: {
  //         filePath: filePath,
  //       },
  //     });
  //     // fetchFileData(fileMetaData.fileId);
  //   } catch (error) {
  //     console.log("Error stopping propagation:", error);
  //     alert("Error deleting image. Please try again later.");
  //   }
  // };

  return (
    <>
      <div className="flex flex-col gap-2">
        {slideData?.map((slide, index) => (
          <div
            key={index}
            className={`relative cursor-pointer border border-gray-300 grid gap  ${
              activeImageIndex === index ? "bg-gray-200" : ""
            }`}
            onClick={() => setActiveImageIndex(index)}
            style={{
              gridTemplateColumns: "100px 1fr",
            }}
          >
            <figure>
              <img
                src={`${BASE_URL}${slide.image}`}
                alt={`Image ${index + 1}`}
                className="w-24 h-24 object-cover"
              />
            </figure>

            <section className="relative p-2">
              <button
                className="text-red-500 border p-1 rounded-full hover:text-red-700 absolute top-1 right-1 "
                // onClick={handleDeleteImage(image)}
              >
                <AiFillDelete size={12} />
              </button>

              <div className="mt-1">
                <h3 className="text-sm ">
                  <span className="font-bold">{`${index + 1}). `}</span>
                  {new Date(slide?.timeStamp).toLocaleTimeString()}
                  <TextArea
                    text={slide.text}
                    id={slide.id}
                    editSlideText={editSlideText}
                  />
                </h3>
              </div>
            </section>
          </div>
        ))}
      </div>
    </>
  );
};

export default LeftSection;
