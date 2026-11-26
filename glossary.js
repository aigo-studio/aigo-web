/**
 * 어른들을 위한 쉬운 AI · 컴퓨터 용어사전
 * 가이드 본문에 등장하는 용어를 마우스 호버, 클릭, 검색으로 쉽게 풀이해 줍니다.
 */
window.GLOSSARY_TERMS = [
  {
    key: 'AI 에이전트',
    aliases: ['AI 에이전트', '에이전트', 'AI 비서'],
    easyTitle: 'AI 에이전트 (스스로 일하는 AI 비서)',
    meaning:
      '단순히 질문에 답만 하는 챗봇을 넘어, 내 컴퓨터의 폴더를 읽고 메모를 정리하거나 파일을 직접 만들어 주는 실행형 AI 비서입니다.',
    analogy: '말로 설명만 해 주는 상담원이 아니라, 옆에서 서류까지 직접 정리해 주는 개인 비서와 같습니다.',
  },
  {
    key: 'GUI',
    aliases: ['GUI', '화면 보며 쓰기'],
    easyTitle: 'GUI (눈으로 보며 마우스로 누르는 화면)',
    meaning:
      '글자 명령어를 외워 치는 대신, 아이콘·버튼·창을 눈으로 보고 마우스로 클릭해서 사용하는 방식입니다.',
    analogy: '스마트폰 앱이나 카카오톡처럼 그림과 버튼을 눌러 쓰는 익숙한 화면입니다.',
  },
  {
    key: 'CLI',
    aliases: ['CLI'],
    easyTitle: 'CLI (글자 명령어로 시키는 방식)',
    meaning:
      '마우스 버튼 없이 까만 명령창에 짧은 영어 글자를 입력해 컴퓨터에 바로 일을 시키는 방식입니다.',
    analogy: '버튼 대신 쪽지에 짧은 지시를 적어 바로 전달하는 방식이라 빠르지만, 처음엔 낯설 수 있습니다.',
  },
  {
    key: '터미널',
    aliases: ['터미널', '명령창', 'PowerShell', 'zsh'],
    easyTitle: '터미널 (컴퓨터와 글자로 대화하는 창)',
    meaning:
      '컴퓨터 내부에 직접 명령을 내릴 수 있는 글자 입력 창입니다. Mac에서는 터미널, Windows에서는 PowerShell이라고 부릅니다.',
    analogy: '자동차 보닛을 열고 정비사가 직접 점검하는 작업실과 같습니다. 이 앱이 대부분 대신 입력해 드립니다.',
  },
  {
    key: 'Work 모드',
    aliases: ['Work 모드', 'Cowork', 'Cowork 모드'],
    easyTitle: 'Work 모드 (내 폴더를 연결해 일하는 모드)',
    meaning:
      'AI 앱에 내 컴퓨터의 특정 폴더를 연결해, 그 안의 메모나 문서를 AI가 직접 읽고 새 파일로 정리해 주는 기능입니다.',
    analogy: '책상 위 서류철 하나를 비서에게 건네주고 "이 안의 메모들을 정리해 줘"라고 맡기는 것과 같습니다.',
  },
  {
    key: 'API 키',
    aliases: ['API 키', 'API Key', 'GEMINI_API_KEY', 'OPENAI_API_KEY', 'ANTHROPIC_API_KEY', '개인 열쇠'],
    easyTitle: 'API 키 (AI 서비스 전용 열쇠)',
    meaning:
      '내 컴퓨터의 프로그램이 구글·OpenAI·Anthropic 같은 AI 회사 서버에 안전하게 연결할 때 쓰는 긴 비밀번호 문자열입니다.',
    analogy: '우리 집 현관 디지털 도어락 비밀번호처럼 본인만 알고 안전하게 보관해야 하는 열쇠입니다.',
  },
  {
    key: 'Node.js',
    aliases: ['Node.js', 'npm'],
    easyTitle: 'Node.js (프로그램을 움직이는 기본 엔진)',
    meaning:
      '최신 AI 도구와 자동화 스크립트가 내 컴퓨터에서 실행될 수 있도록 바탕이 되어 주는 무료 실행 엔진입니다.',
    analogy: '가전제품을 쓰기 위해 벽에 꽂아 두는 전기 콘센트(전원 장치) 같은 기본 토대입니다.',
  },
  {
    key: 'Homebrew',
    aliases: ['Homebrew', 'brew', 'brew cask'],
    easyTitle: 'Homebrew (Mac용 자동 설치 도우미)',
    meaning:
      'Mac 컴퓨터에서 웹사이트를 일일이 찾아다니지 않고 명령어 한 줄로 필요한 앱과 도구를 자동 설치해 주는 공식 무료 도구입니다.',
    analogy: 'Mac 안에 들어 있는 자동 배달 마트라고 생각하시면 됩니다.',
  },
  {
    key: 'winget',
    aliases: ['winget'],
    easyTitle: 'winget (Windows용 자동 설치 도우미)',
    meaning:
      'Windows 10·11에 기본으로 들어 있는 Microsoft 공식 프로그램 자동 설치 도구입니다.',
    analogy: '설치 파일을 직접 찾아 누르지 않아도 Windows가 알아서 안전한 공식 프로그램을 깔아 주는 도우미입니다.',
  },
  {
    key: '패키지 관리자',
    aliases: ['패키지 관리자'],
    easyTitle: '패키지 관리자 (프로그램 자동 설치·관리 도구)',
    meaning:
      'Mac의 Homebrew나 Windows의 winget처럼 필요한 프로그램을 안전하게 찾아 자동으로 설치·업데이트해 주는 도구입니다.',
    analogy: '휴대폰의 앱스토어(플레이스토어)를 컴퓨터에서 버튼 하나로 자동 실행하는 기능입니다.',
  },
  {
    key: 'Antigravity',
    aliases: ['Antigravity', 'Google Antigravity', '안티그래비티'],
    easyTitle: 'Google Antigravity (구글 AI 에이전트 작업 앱)',
    meaning:
      '구글이 만든 시각적 AI 에이전트 앱·IDE로, 개인 Google 계정으로 무료 시작해 파일 정리와 간단한 앱 만들기까지 화면을 보며 할 수 있습니다.',
    analogy: 'Gemini 대화창에 내 컴퓨터 서류함과 작업대가 한꺼번에 합쳐진 확장판 작업실입니다.',
  },
  {
    key: 'Codex',
    aliases: ['Codex', 'OpenAI Codex'],
    easyTitle: 'OpenAI Codex (ChatGPT 회사의 작업용 AI 비서)',
    meaning:
      'ChatGPT를 만든 OpenAI에서 제공하는 파일·작업 자동화용 AI 비서입니다. 앱(GUI)과 터미널(CLI) 모두 지원합니다.',
    analogy: 'ChatGPT에게 내 컴퓨터 작업 폴더를 열어 함께 정리하도록 확장한 비서입니다.',
  },
  {
    key: 'Claude',
    aliases: ['Claude', 'Claude Desktop', 'Claude Code'],
    easyTitle: 'Claude (문장·문서 정리에 강한 AI 비서)',
    meaning:
      'Anthropic이 만든 AI 비서로, 한국어 문장을 부드럽고 자연스럽게 다듬고 긴 문서를 요약하는 데 강점이 있습니다.',
    analogy: '글을 차분하고 정중하게 잘 써 주는 비서 선생님 같은 도구입니다.',
  },
  {
    key: 'Ollama',
    aliases: ['Ollama', '로컬 Ollama', 'gemma3:4b'],
    easyTitle: 'Ollama (내 컴퓨터에서 무료로 돌리는 AI)',
    meaning:
      '외부 유료 서버에 연결하지 않고, 무료 AI 모델을 내 컴퓨터에 직접 내려받아 인터넷 없이도 쓸 수 있게 해 주는 프로그램입니다.',
    analogy: '도서관에 매번 가지 않고 집에 백과사전을 한 권 들여놓고 무료로 펼쳐 보는 방식입니다.',
  },
  {
    key: 'Obsidian',
    aliases: ['Obsidian', '옵시디언'],
    easyTitle: 'Obsidian (무료 개인 메모·수첩 앱)',
    meaning:
      '내 컴퓨터의 일반 폴더 안에 저장된 메모 파일(.md)을 예쁜 수첩처럼 보여 주고 검색·정리해 주는 무료 메모 앱입니다.',
    analogy: '내 컴퓨터 폴더를 그대로 깔끔한 다이어리 책으로 펼쳐서 보는 뷰어입니다.',
  },
  {
    key: '보관함',
    aliases: ['보관함', 'Vault'],
    easyTitle: '보관함 / Vault (Obsidian 메모가 모이는 폴더)',
    meaning:
      'Obsidian에서 메모 파일들을 모아 두는 하나의 전용 폴더를 뜻합니다. 우리 앱에서는 지정한 작업 폴더를 그대로 보관함으로 씁니다.',
    analogy: '집에 두는 전용 서류함 한 칸이라고 생각하시면 쉽습니다.',
  },
  {
    key: 'Notion',
    aliases: ['Notion', '노션'],
    easyTitle: 'Notion (가족과 공유하기 좋은 온라인 수첩)',
    meaning:
      '메모, 달력, 표, 체크리스트를 한곳에 정리하고 자녀나 가족과 실시간으로 공유할 수 있는 온라인 정리 앱입니다.',
    analogy: '가족 모두가 휴대폰으로 함께 볼 수 있는 냉장고 앞 공용 달력·메모판과 같습니다.',
  },
  {
    key: '텔레그램',
    aliases: ['텔레그램', 'Telegram', '봇 토큰', 'BotFather', '채팅 ID'],
    easyTitle: '텔레그램 봇 (내 휴대폰으로 알림 보내는 무료 비서)',
    meaning:
      '카카오톡 같은 무료 메신저인 텔레그램 안에 나만의 알림 봇을 만들어, 컴퓨터가 휴대폰으로 일정·브리핑 알림을 보내게 하는 기능입니다.',
    analogy: '집에 있는 컴퓨터가 내 휴대폰으로 바로 문자를 보내 주는 무료 전용 우체부입니다.',
  },
  {
    key: '웹후크',
    aliases: ['웹후크', '웹훅', 'Webhook', '디스코드'],
    easyTitle: '웹후크 (디스코드 채널로 알림을 넣는 주소)',
    meaning:
      '디스코드 채널마다 만들 수 있는 전용 주소입니다. 이 주소로 글을 보내면 그 채널에 알림이 올라옵니다. 봇을 따로 만들 필요가 없습니다.',
    analogy: '채널 앞에 달린 우편함 주소와 같습니다. 주소를 아는 사람은 편지를 넣을 수 있으니 남에게 알려 주지 마세요.',
  },
  {
    key: '프롬프트',
    aliases: ['프롬프트'],
    easyTitle: '프롬프트 · 규칙 파일 (AI에게 건네는 부탁 문장)',
    meaning:
      'AI에게 일을 시킬 때 적는 질문이나 지시 문장을 말합니다. GEMINI.md·AGENTS.md·CLAUDE.md에 규칙을 적어 두면 매번 말투를 다시 설명하지 않아도 됩니다.',
    analogy: '새로 온 비서에게 "항상 쉬운 말로, 번호를 매겨 보고해 주세요"라고 적어 주는 인수인계 노트입니다.',
  },
  {
    key: 'HTML',
    aliases: ['HTML', '.html'],
    easyTitle: 'HTML (인터넷 창에서 바로 열리는 화면 파일)',
    meaning:
      '복용약 체크표처럼 더블클릭하면 크롬·사파리·엣지 같은 인터넷 창에서 큰 글씨 화면으로 바로 열리는 파일 형식입니다.',
    analogy: '별도 앱을 깔지 않아도 인터넷 창만 있으면 바로 펼쳐지는 나만의 전자 종이입니다.',
  },
  {
    key: 'LaunchAgent',
    aliases: ['LaunchAgent', '시작 프로그램', '백그라운드'],
    easyTitle: '백그라운드 자동 실행 (LaunchAgent · 시작 프로그램)',
    meaning:
      '컴퓨터 전원을 켤 때마다 사용자가 일일이 아이콘을 누르지 않아도, 화면 뒤에 조용히 필요한 비서 프로그램을 켜 두는 기능입니다.',
    analogy: '아침에 일어나면 보일러나 알람이 알아서 켜져 있는 것처럼 뒤에서 조용히 대기하는 설정입니다.',
  },
  {
    key: '폴백',
    aliases: ['폴백', 'Fallback'],
    easyTitle: '폴백 (자동 실패 시 안전한 대체 방법)',
    meaning:
      '원클릭 자동 설치가 환경 문제로 실패했을 때 멈추지 않고, 자동으로 공식 다운로드 페이지를 열어 주는 안전망 기능입니다.',
    analogy: '지름길이 막혔을 때 내비게이션이 바로 안전한 큰길로 안내해 주는 것과 같습니다.',
  },
  {
    key: '클라우드',
    aliases: ['클라우드', 'Cloud', 'iCloud', '구글 드라이브'],
    easyTitle: '클라우드 (인터넷에 있는 나만의 안전 보관함)',
    meaning:
      '사진이나 문서를 내 컴퓨터에만 두지 않고, 구글·애플 같은 회사의 인터넷 저장 공간에 보관해 두는 방식입니다.',
    analogy: '집 장롱 대신 은행 안전금고에 물건을 맡겨 두고, 휴대폰이나 다른 컴퓨터에서도 언제든 꺼내 보는 것과 같습니다.',
  },
  {
    key: '동기화',
    aliases: ['동기화', 'Sync'],
    easyTitle: '동기화 (컴퓨터와 휴대폰 내용을 똑같이 맞추기)',
    meaning:
      '컴퓨터에서 메모를 고치면 휴대폰에서도 자동으로 똑같이 바뀌도록 최신 상태를 서로 맞춰 주는 기능입니다.',
    analogy: '거실 달력에 일정을 적으면 안방 달력에도 저절로 똑같이 적히는 편리한 기능입니다.',
  },
  {
    key: '압축 해제',
    aliases: ['압축 해제', '압축 풀기', '.zip', 'ZIP'],
    easyTitle: '압축 해제 (묶여 있는 파일 보따리 풀기)',
    meaning:
      '여러 파일이나 용량이 큰 설치 파일을 한 덩어리(.zip)로 묶어 둔 것을 원래대로 펼쳐서 쓸 수 있게 푸는 작업입니다.',
    analogy: '택배 상자나 진공 포장된 이불 봉지를 뜯어 원래 크기로 펼치는 것과 같습니다.',
  },
  {
    key: '복사 · 붙여넣기',
    aliases: ['복사', '붙여넣기', '단축키', 'Ctrl+C', 'Cmd+C'],
    easyTitle: '복사 · 붙여넣기 단축키 (글자 옮기기)',
    meaning:
      '글자를 다시 타자 치지 않고 그대로 옮기는 기능입니다. Mac은 ⌘(커맨드)+C(복사), ⌘+V(붙여넣기), Windows는 Ctrl+C(복사), Ctrl+V(붙여넣기)를 누릅니다.',
    analogy: '종이에 적힌 전화번호를 복사기로 찍어서 다른 공책에 그대로 붙이는 것과 같습니다.',
  },
  {
    key: '확장자',
    aliases: ['확장자', '.dmg', '.exe', '.txt', '.md', '.command', '.bat'],
    easyTitle: '확장자 (파일 이름 끝의 점 뒤 글자)',
    meaning:
      '파일 이름 맨 끝의 .txt(메모), .dmg(Mac 설치 파일), .exe(Windows 설치 파일), .md(수첩 문서)처럼 파일의 종류를 알려 주는 꼬리표입니다.',
    analogy: '음식 용기 겉면에 "김치", "국", "반찬"이라고 붙여 둔 이름표와 같습니다.',
  },
  {
    key: '관리자 권한',
    aliases: ['관리자 권한', 'UAC', 'sudo', '허용 팝업'],
    easyTitle: '관리자 권한 (컴퓨터 주인 확인 절차)',
    meaning:
      '새 프로그램을 설치하거나 중요한 설정을 바꿀 때, 컴퓨터가 "정말 주인이 허락한 작업인가요?"라고 한 번 더 묻는 보안 확인입니다.',
    analogy: '열쇠공이 집 문에 새 잠금장치를 달기 전에 집주인 신분증을 한 번 확인하는 것과 같습니다.',
  },
  {
    key: '브라우저',
    aliases: ['브라우저', '크롬', '사파리', '엣지', '인터넷 창'],
    easyTitle: '브라우저 (인터넷을 열어 보는 창)',
    meaning:
      '네이버, 유튜브, 구글 같은 웹사이트를 열어 보는 프로그램입니다. 크롬(Chrome), 사파리(Safari), 엣지(Edge)가 대표적입니다.',
    analogy: '텔레비전 채널을 틀어 주는 리모컨 겸 화면이라고 생각하시면 됩니다.',
  },
  {
    key: '작업 폴더',
    aliases: ['작업 폴더', '경로', '바탕화면'],
    easyTitle: '작업 폴더 · 경로 (파일이 보관되는 주소)',
    meaning:
      'AI 비서와 함께 문서를 저장하는 전용 폴더와, 그 폴더가 컴퓨터 안 어디에 있는지 알려 주는 위치 주소(경로)를 뜻합니다.',
    analogy: '"서울시 ○○구 ○○동 101호"처럼 컴퓨터 안에서 내 파일이 사는 집 주소입니다.',
  },
  {
    key: 'GitHub',
    aliases: ['GitHub', '깃허브', '저장소', 'Repository'],
    easyTitle: 'GitHub / 깃허브 (전 세계 무료 레시피 도서관)',
    meaning:
      '전 세계 개발자들이 만든 프로그램 설계도(코드)를 무료로 공개하고 함께 개선하는 온라인 도서관입니다.',
    analogy: '누구나 검증된 요리 레시피를 무료로 찾아보고 내 입맛대로 응용할 수 있는 거대한 요리책 도서관입니다.',
  },
  {
    key: '오픈소스',
    aliases: ['오픈소스', 'Open Source', '레퍼런스'],
    easyTitle: '오픈소스 · 레퍼런스 (참고할 수 있는 공개 설계도)',
    meaning:
      '누구나 안의 내용을 투명하게 들여다보고 무료로 참고해 응용할 수 있도록 공개된 프로그램이나 참고 자료를 말합니다.',
    analogy: '비밀 레시피가 아니라 재료와 만드는 법이 투명하게 공개되어 안심하고 참고할 수 있는 표준 요리법입니다.',
  },
  {
    key: '보안 검열',
    aliases: ['보안 검열', '악성코드', '안전 검사'],
    easyTitle: '보안 검열 · 안전 검사 (위험한 코드 미리 걸러내기)',
    meaning:
      '외부에서 가져온 코드 안에 내 개인정보를 빼가거나 컴퓨터를 망가뜨리는 위험한 명령어가 숨어 있는지 실행 전에 먼저 확인하는 절차입니다.',
    analogy: '집에 들일 택배나 식재료가 상하지 않았는지 요리하기 전에 꼼꼼히 확인하는 검수 과정입니다.',
  },  {
    key: '지침 파일',
    aliases: ['지침 파일', 'AI 수첩', '규칙 파일', 'GEMINI.md', 'AGENTS.md', 'CLAUDE.md'],
    easyTitle: '지침 파일 · AI 수첩 (AGENTS.md 등)',
    meaning:
      'AI가 대화를 시작할 때마다 먼저 읽는 메모 파일입니다. 비서마다 이름이 달라 Codex는 AGENTS.md, Claude는 CLAUDE.md, Gemini는 GEMINI.md를 읽습니다.',
    analogy: '새 비서가 출근하자마자 펴 보는 업무 수첩입니다. 한 번 적어 두면 매번 다시 말하지 않아도 됩니다.',
  },
  {
    key: '세션',
    aliases: ['세션', '새 대화', '대화방'],
    easyTitle: '세션 (대화방 하나, 공책 한 권)',
    meaning:
      'AI와 주고받는 대화 한 묶음입니다. 새 대화를 열면 앞 대화 내용은 모르는 상태에서 시작합니다.',
    analogy: '공책 한 권과 같습니다. 새 공책을 펴면 앞 공책에 쓴 내용은 보이지 않습니다.',
  },
  {
    key: '토큰',
    aliases: ['토큰'],
    easyTitle: '토큰 (AI가 읽고 쓰는 글자 양의 단위)',
    meaning:
      'AI가 읽고 쓰는 글자 양을 세는 단위입니다. 대화가 길수록, 보여 준 파일이 클수록 많이 씁니다.',
    analogy: '휴대폰 데이터 요금의 "메가바이트"처럼, 쓴 만큼 줄어드는 사용량 단위입니다.',
  },
  {
    key: '사용 한도',
    aliases: ['사용 한도', '한도'],
    easyTitle: '사용 한도 (일정 시간 동안 쓸 수 있는 양)',
    meaning:
      '정해진 시간 동안 AI를 쓸 수 있는 양입니다. 다 쓰면 잠시 멈추고, 시간이 지나면 다시 찹니다. 실제 양은 요금제마다 다릅니다.',
    analogy: '휴대폰 데이터를 다 쓰면 느려졌다가 다음 달에 다시 채워지는 것과 비슷합니다.',
  },
  {
    key: '컨텍스트',
    aliases: ['컨텍스트'],
    easyTitle: '컨텍스트 (AI가 지금 펴 놓고 보는 공책 내용)',
    meaning:
      'AI가 대답할 때 함께 읽는 지금까지의 대화와 파일 내용 전체입니다. AI는 대답할 때마다 이것을 처음부터 다시 읽습니다.',
    analogy: '책상 위에 펼쳐 둔 공책입니다. 너무 두꺼워지면 앞쪽 내용을 헷갈리기 시작합니다.',
  },
  {
    key: '모델',
    aliases: ['모델', '큰 모델', '작은 모델', '가벼운 모델'],
    easyTitle: '모델 (AI의 두뇌 종류)',
    meaning:
      '같은 AI 앱 안에서 고를 수 있는 두뇌의 종류입니다. 큰 모델은 어려운 판단에, 작은 모델은 빠르고 간단한 일에 씁니다. 이름은 자주 바뀝니다.',
    analogy: '큰 모델은 전문가, 작은 모델은 손 빠른 도우미입니다. 일에 맞는 사람을 부르면 됩니다.',
  },
  {
    key: 'MCP',
    aliases: ['MCP', '연결 도구'],
    easyTitle: 'MCP (AI에 꽂는 플러그)',
    meaning:
      'AI가 달력·메일 같은 다른 서비스를 직접 쓰게 이어 주는 연결 방식입니다. 공식 앱의 설정 → 연결 메뉴로만 켜세요.',
    analogy: '전자제품에 꽂는 플러그입니다. 믿을 수 있는 콘센트에만 꽂아야 안전합니다.',
  },
  {
    key: '스킬',
    aliases: ['스킬', '요리법 카드'],
    easyTitle: '스킬 (요리법 카드)',
    meaning:
      '자주 하는 일의 순서를 파일에 적어 두고 "이 카드대로 해 줘"라고 부탁하는 방법입니다.',
    analogy: '부엌 벽에 붙여 둔 요리법 카드입니다. 순서를 매번 설명하지 않아도 됩니다.',
  },
];

window.GlossaryHelper = (() => {
  const termMap = new Map();
  const aliasList = [];

  for (const entry of window.GLOSSARY_TERMS) {
    termMap.set(entry.key, entry);
    for (const alias of entry.aliases) {
      aliasList.push({ alias, key: entry.key });
    }
  }

  // 긴 단어부터 먼저 매칭되도록 내림차순 정렬
  aliasList.sort((a, b) => b.alias.length - a.alias.length);

  function escapeHtml(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  const combinedRegex = new RegExp(
    `(${aliasList.map((item) => escapeRegex(item.alias)).join('|')})`,
    'g'
  );

  const aliasToKey = new Map();
  for (const item of aliasList) {
    aliasToKey.set(item.alias.toLowerCase(), item.key);
  }

  function highlightText(rawText) {
    const safe = escapeHtml(rawText);
    return safe.replace(combinedRegex, (matched) => {
      const key = aliasToKey.get(matched.toLowerCase());
      if (!key) return matched;
      return `<span class="glossary-term" data-term-key="${escapeHtml(key)}" tabindex="0">${matched}</span>`;
    });
  }

  function getByKey(key) {
    return termMap.get(key) || null;
  }

  function search(rawQuery) {
    const q = String(rawQuery || '').trim().toLowerCase();
    if (!q) return window.GLOSSARY_TERMS;
    return window.GLOSSARY_TERMS.filter((item) => {
      if (item.key.toLowerCase().includes(q)) return true;
      if (item.easyTitle.toLowerCase().includes(q)) return true;
      if (item.meaning.toLowerCase().includes(q)) return true;
      return item.aliases.some(
        (alias) => alias.toLowerCase().includes(q) || q.includes(alias.toLowerCase())
      );
    });
  }

  return {
    escapeHtml,
    highlightText,
    getByKey,
    search,
    allTerms: window.GLOSSARY_TERMS,
  };
})();
