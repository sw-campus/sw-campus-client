'use client'

export default function PrivacyContent() {
  return (
    <div className="space-y-6 text-sm text-neutral-700">
      <section>
        <h4 className="mb-2 text-base font-bold text-neutral-900">1. 개인정보의 수집 및 이용 목적</h4>
        <p className="leading-relaxed">
          Software Campus(이하 "회사")는 다음의 목적을 위하여 개인정보를 처리합니다. 처리하고 있는 개인정보는 다음의
          목적 이외의 용도로는 이용되지 않으며, 이용 목적이 변경되는 경우에는 개인정보 보호법 제18조에 따라 별도의
          동의를 받는 등 필요한 조치를 이행할 예정입니다.
        </p>
        <ul className="mt-2 list-disc space-y-1 pl-5 leading-relaxed">
          <li>회원 가입 의사 확인, 회원제 서비스 제공에 따른 본인 식별·인증</li>
          <li>교육과정 수강신청 및 관리, 수료증 발급</li>
          <li>서비스 부정이용 방지, 각종 고지·통지, 고충처리</li>
          <li>신규 서비스(제품) 개발 및 맞춤 서비스 제공</li>
        </ul>
      </section>

      <section>
        <h4 className="mb-2 text-base font-bold text-neutral-900">2. 수집하는 개인정보 항목 및 수집방법</h4>
        <p className="mb-2 leading-relaxed">
          회사는 회원가입 및 서비스 제공을 위해 아래와 같은 개인정보를 수집하고 있습니다.
        </p>
        <ul className="list-disc space-y-1 pl-5 leading-relaxed">
          <li>
            <span className="font-medium">필수항목:</span> 이메일, 비밀번호, 이름, 휴대전화번호
          </li>
          <li>
            <span className="font-medium">선택항목:</span> 마케팅 정보 수신 동의 여부
          </li>
          <li>
            <span className="font-medium">수집방법:</span> 홈페이지 회원가입, 수강신청 및 상담
          </li>
        </ul>
      </section>

      <section>
        <h4 className="mb-2 text-base font-bold text-neutral-900">3. 개인정보의 보유 및 이용기간</h4>
        <p className="leading-relaxed">
          회사는 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터 개인정보를 수집 시에 동의받은 개인정보
          보유·이용기간 내에서 개인정보를 처리·보유합니다.
        </p>
        <ul className="mt-2 list-disc space-y-1 pl-5 leading-relaxed">
          <li>회원 가입 및 관리: 회원 탈퇴 시까지</li>
          <li>다만, 관계 법령 위반에 따른 수사·조사 등이 진행 중인 경우에는 해당 수사·조사 종료 시까지 보유합니다.</li>
        </ul>
      </section>

      <section>
        <h4 className="mb-2 text-base font-bold text-neutral-900">4. 개인정보의 파기절차 및 방법</h4>
        <p className="leading-relaxed">
          회사는 개인정보 보유기간의 경과, 처리목적 달성 등 개인정보가 불필요하게 되었을 때에는 지체없이 해당 개인정보를
          파기합니다. 전자적 파일 형태의 정보는 기록을 재생할 수 없는 기술적 방법을 사용합니다.
        </p>
      </section>

      <section>
        <h4 className="mb-2 text-base font-bold text-neutral-900">5. 개인정보의 제3자 제공</h4>
        <p className="leading-relaxed">
          회사는 이용자의 개인정보를 원칙적으로 외부에 제공하지 않습니다. 다만, 이용자들이 사전에 동의한 경우나 법령의
          규정에 의거하거나, 수사 목적으로 법령에 정해진 절차와 방법에 따라 수사기관의 요구가 있는 경우는 예외로 합니다.
        </p>
      </section>

      <section>
        <h4 className="mb-2 text-base font-bold text-neutral-900">6. 이용자 및 법정대리인의 권리와 그 행사방법</h4>
        <p className="leading-relaxed">
          이용자는 회사에 대해 언제든지 개인정보 열람·정정·삭제·처리정지 요구 등의 권리를 행사할 수 있습니다. 권리
          행사는 회사에 대해 서면, 전화, 전자우편, 모사전송(FAX) 등을 통하여 하실 수 있으며 회사는 이에 대해 지체없이
          조치하겠습니다.
        </p>
      </section>

      <section>
        <h4 className="mb-2 text-base font-bold text-neutral-900">7. 개인정보의 안전성 확보조치</h4>
        <p className="leading-relaxed">
          회사는 개인정보의 안전성 확보를 위해 관리적 조치(내부관리계획 수립·시행, 정기적 직원 교육 등), 기술적
          조치(개인정보처리시스템 등의 접근권한 관리, 접근통제시스템 설치, 고유식별정보 등의 암호화, 보안프로그램
          설치)를 취하고 있습니다.
        </p>
      </section>

      <div className="mt-8 border-t border-neutral-200 pt-4 text-xs text-neutral-500">
        <p>공고일자: 2025년 1월 1일</p>
        <p>시행일자: 2025년 1월 1일</p>
      </div>
    </div>
  )
}
