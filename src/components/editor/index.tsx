import dynamic from "next/dynamic";
import { styled } from "@mui/material/styles";
import { Box } from "@mui/material";
import "react-quill/dist/quill.snow.css";
import { Quill } from "react-quill";
const EditorToolbar = dynamic(() => import("./EditorToolbar"), {
  loading: () => <p>loading...</p>,

  ssr: false,
});

const ReactQuill = dynamic(
  async () => {
    const { default: RQ } = await import("react-quill");
    const { default: ImageResize } = await import("quill-blot-formatter");
    RQ.Quill.register("modules/imageResize", ImageResize);
    return function forwardRef({ forwardedRef, ...props }: any) {
      return <RQ ref={forwardedRef} {...props} />;
    };
  },
  {
    ssr: false,
  }
);
const formats = [
  "align",
  "background",
  "blockquote",
  "bold",
  "bullet",
  "code",
  "code-block",
  "color",
  "direction",
  "font",
  "formula",
  "header",
  "image",
  "indent",
  "italic",
  "link",
  "list",
  "script",
  "size",
  "strike",
  "table",
  "underline",
  "video",
];

const RootStyle = styled(Box)(({ theme }: any) => ({
  overflow: "hidden",
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  border: `solid 1px ${theme.palette.grey[500_32]}`,
  "& .ql-container.ql-snow": {
    borderColor: "transparent",
    ...theme.typography.body1,
    fontFamily: theme.typography.fontFamily,
  },
  "& .ql-editor": {
    minHeight: 200,
    "&.ql-blank::before": {
      fontStyle: "normal",
      color: theme.palette.text.disabled,
    },
    "& pre.ql-syntax": {
      ...theme.typography.body2,
      padding: theme.spacing(2),
      borderRadius: theme.shape.borderRadius,
      backgroundColor: theme.palette.grey[900],
    },
  },
}));

export default function Editor({
  id = "admincp-quill",
  error,
  value,
  onChange,
  simple = false,
  helperText,
  sx,
  ...other
}: any) {
  const modules = {
    toolbar: {
      container: `#${id}`,
    },

    history: {
      delay: 500,
      maxStack: 100,
      userOnly: true,
    },
    syntax: false,
    clipboard: {
      matchVisual: false,
    },
    imageResize: {
      parchment: Quill.import("parchment"),
      modules: ["Resize", "DisplaySize"],
    },
  };

  return (
    <Box sx={{ border: "1px solid black", marginTop: "20px", width: "100%" }}>
      <RootStyle
        sx={{
          ...(error && {
            border: (theme) => `solid 1px ${theme.palette.error.main}`,
          }),
          ...sx,
        }}
      >
        <EditorToolbar id={id} isSimple={simple} />
        <ReactQuill
          value={value}
          onChange={onChange}
          modules={modules}
          formats={formats}
          placeholder="Write something awesome..."
          {...other}
        />
      </RootStyle>
      {helperText && helperText}
    </Box>
  );
}
