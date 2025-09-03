"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAnswer = generateAnswer;
function generateAnswer(userMessage, attachedFile) {
    const message = userMessage.toLowerCase().trim();
    // 파일 쓰기 요청 감지 (더 정확한 패턴)
    const fileWritePatterns = [
        /[a-zA-Z0-9._-]+\.(md|txt|json|js|ts|py|html|css|xml|yml|yaml)\s*에/,
    ];
    for (const pattern of fileWritePatterns) {
        if (pattern.test(message)) {
            return {
                type: "file-write",
                content: `파일 쓰기 요청을 처리하고 있습니다...`,
            };
        }
    }
    // 날씨 키워드 감지
    if (message.includes("날씨") || message.includes("weather")) {
        return {
            type: "weather",
            content: `안녕하세요! 현재 서울의 날씨에 대해 알려드리겠습니다.

오늘 서울은 맑은 하늘과 함께 기온이 15도 정도로 쾌적한 날씨를 보이고 있습니다. 

아침에는 약간 쌀쌀하지만 낮에는 따뜻한 햇살이 내리쬐어 외출하기에 좋은 날씨입니다. 

미세먼지 농도도 보통 수준으로 공기질이 양호한 편이니 마스크 없이도 걱정 없이 외출하실 수 있습니다.

저녁에는 기온이 조금 떨어질 예정이니 얇은 겉옷을 준비하시는 것을 추천드립니다.

전체적으로 매우 쾌적하고 상쾌한 날씨가 계속될 것으로 예상됩니다!`,
        };
    }
    // 버튼 컴포넌트 키워드 감지
    if (message.includes("버튼") && message.includes("컴포넌트")) {
        return {
            type: "button",
            content: `버튼 컴포넌트를 만들어드리겠습니다!

\`\`\`tsx
import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  className = '',
}) => {
  const baseClasses = 'font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
  };
  
  const sizeClasses = {
    small: 'px-3 py-1.5 text-sm',
    medium: 'px-4 py-2 text-base',
    large: 'px-6 py-3 text-lg',
  };
  
  const disabledClasses = disabled 
    ? 'opacity-50 cursor-not-allowed' 
    : 'cursor-pointer';

  return (
    <button
      className={\`\${baseClasses} \${variantClasses[variant]} \${sizeClasses[size]} \${disabledClasses} \${className}\`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

// 사용 예시
export const ButtonExample = () => {
  return (
    <div className="space-x-4">
      <Button onClick={() => alert('Primary 버튼 클릭!')}>
        Primary Button
      </Button>
      <Button variant="secondary" onClick={() => alert('Secondary 버튼 클릭!')}>
        Secondary Button
      </Button>
      <Button variant="danger" size="large" onClick={() => alert('Danger 버튼 클릭!')}>
        Danger Button
      </Button>
      <Button disabled>
        Disabled Button
      </Button>
    </div>
  );
};
\`\`\`

이 버튼 컴포넌트는 다음과 같은 기능을 제공합니다:

- **다양한 스타일**: primary, secondary, danger 변형
- **크기 조절**: small, medium, large
- **비활성화**: disabled 상태 지원
- **접근성**: 키보드 포커스 및 스크린 리더 지원
- **타입 안전성**: TypeScript로 완전히 타입이 지정됨

Tailwind CSS를 사용하고 있으니 프로젝트에 Tailwind가 설정되어 있어야 합니다.`,
        };
    }
    // 첨부 파일이 있는 경우
    if (attachedFile) {
        return {
            type: "default",
            content: `첨부해주신 파일 "${attachedFile.name}"을 분석해보겠습니다.

**파일 정보:**
- 파일명: ${attachedFile.name}
- 언어: ${attachedFile.language}
- 크기: ${attachedFile.content.length} 문자

**파일 내용 분석:**

\`\`\`${attachedFile.language}
${attachedFile.content.substring(0, 500)}${attachedFile.content.length > 500
                ? "\n... (내용이 길어 일부만 표시)"
                : ""}
\`\`\`

${userMessage}에 대한 답변을 드리기 위해 파일 내용을 참고하겠습니다.

이 파일의 구조와 내용을 바탕으로 더 구체적인 도움을 드릴 수 있을 것 같습니다. 

특별히 궁금한 부분이나 개선하고 싶은 부분이 있으시다면 말씀해 주세요!`,
        };
    }
    // 기본 답변
    return {
        type: "default",
        content: `안녕하세요! ${userMessage}에 대해 도와드리겠습니다.

먼저 기본적인 정보를 확인해보겠습니다. 이 질문은 매우 흥미로운 주제네요.

더 자세한 설명을 드리기 위해 몇 가지 추가 정보가 필요할 것 같습니다.

혹시 특별히 궁금한 부분이 있으시다면 언제든 말씀해 주세요!`,
    };
}
//# sourceMappingURL=answer.js.map