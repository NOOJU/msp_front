export type TextInputProps = {
  textInputProps: TextInputObjProps; // 이름 수정
};

export type TextInputObjProps = {
  name?: string; //속성 이름
  // default?: any; //기본 값
  placeholder?: string; //입력 필드에 아무 값도 없을 때 표시되는 안내 텍스트입니다.
  onChanger: (value: string) => void; //이벤트 핸들러
  onReplace?: (value: string) => string;
  disabled?: boolean; //입력 불 가능 여부
  value?: any;
  onEnterEvent?: (e: React.FormEvent<Element>) => void; // 엔터시 실행할 이벤트
};

// Select Inpnt Type
export type SelectInputObjProps = {
  name: string;
  defaultValue?: string;
  selectList: {
    value: string; // 옵션 값
    text: string; // 표시될 텍스트
  }[];
  onChanger: (value: string) => void;
};

// Text Area Input
export type TextAreaObjProps = {
  name: string;
  defaultValue?: string;
  placeholder?: string;
  onChanger: (value: string) => void;
};
