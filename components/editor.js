import { useEffect } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
const Editor = () => {
  const [isLayoutReady, setIsLayoutReady] = useState(false);
  useEffect(() => {
    setIsLayoutReady(true);
  }, []);
};
export default Editor;
