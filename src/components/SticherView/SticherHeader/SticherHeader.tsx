import { palette } from "../../../utils/palette";
import { SticherHeaderIdTypes, sticherHeaderOptions } from "../utils";

interface SticherHeaderProps {
  activeHeaderOption: string | null;
  onHeaderOptionClick: (option: SticherHeaderIdTypes) => void;
}

const SticherHeader: React.FC<SticherHeaderProps> = ({
  activeHeaderOption,
  onHeaderOptionClick,
}) => {
  return (
    <nav
      className="bg-white boxShadow rounded-lg py-4 px-6 grid gap-2"
      style={{ gridTemplateColumns: "1fr 2px 180px" }}
    >
      <div className="flex items-center justify-between gap-2">
        {sticherHeaderOptions.slice(0, -2).map((option) => (
          <button
            onClick={() => onHeaderOptionClick(option.id)}
            className="flex items-center cursor-pointer border py-[6px] px-2 rounded-md"
            style={{
              backgroundColor:
                activeHeaderOption === option.id ? "#E6F4FF" : "",
              borderColor:
                activeHeaderOption === option.id
                  ? palette.primaryLight
                  : "#d1d1d1",
            }}
          >
            <option.icon
              size={option.iconSize || 22}
              color={
                activeHeaderOption === option.id ? palette.primary : "#707070"
              }
            />
            <span
              className="ml-2 text-sm font-semibold"
              style={{
                color:
                  activeHeaderOption === option.id
                    ? palette.primary
                    : "#707070",
              }}
            >
              {option.title}
            </span>
          </button>
        ))}
      </div>

      <div className="h-full w-[2px] bg-[#e9e8e8]"></div>

      <div className="flex items-center justify-between gap-2">
        {sticherHeaderOptions.slice(-2).map((option) => (
          <button
            className="flex items-center cursor-pointer border  py-[6px] px-2 rounded-md"
            style={{
              borderColor: palette.primaryLight,
              backgroundColor: option.id === "import" ? "" : palette.primary,
            }}
          >
            <option.icon
              size={option.iconSize || 20}
              className="text-gray-500 hover:text-gray-700"
              style={{
                color: option.id === "import" ? palette.primary : "white",
              }}
            />
            <span
              className="ml-2 text-sm font-semibold"
              style={{
                color: option.id === "import" ? palette.primary : "white",
              }}
            >
              {option.title}
            </span>
          </button>
        ))}
      </div>
    </nav>
  );
};

export default SticherHeader;
