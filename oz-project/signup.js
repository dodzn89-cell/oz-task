const form = document.getElementById("signupForm");
const result = document.getElementById("result");
const error = document.getElementById("error");

function showError(msg) {
  error.classList.remove("d-none");
  result.classList.add("d-none");
  error.textContent = msg;
}

//  비밀번호 규칙: 8~29자 + 영문/숫자/특수문자 포함
function isValidPassword(pw) {
  if (pw.length < 8 || pw.length >= 30) return false;
  const hasLetter = /[A-Za-z]/.test(pw);
  const hasNumber = /[0-9]/.test(pw);
  const hasSpecial = /[^A-Za-z0-9]/.test(pw);
  return hasLetter && hasNumber && hasSpecial;
}

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const id = document.getElementById("id").value.trim();
  const pw = document.getElementById("pw").value;
  const pw2 = document.getElementById("pw2").value;
  const name = document.getElementById("name").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const email = document.getElementById("email").value.trim();
  const gender = document.querySelector('input[name="gender"]:checked')?.value || "";

  if (id.length < 4) return showError("아이디는 4자 이상이어야 합니다.");
  if (!isValidPassword(pw)) return showError("비밀번호 규칙을 확인해주세요. (영문+숫자+특수문자, 8~29자)");
  if (pw !== pw2) return showError("비밀번호 확인이 일치하지 않습니다.");
  if (!name) return showError("이름을 입력해주세요.");
  if (!phone) return showError("전화번호를 입력해주세요.");
  if (!email.includes("@")) return showError("이메일 형식이 올바르지 않습니다.");

  //  부모창으로 결과 전달
  if (window.opener) {
    window.opener.postMessage(
      { type: "SIGNUP_DONE", id, name, gender, email },
      "*"
    );
  }

  error.classList.add("d-none");
  result.classList.remove("d-none");
  result.textContent = `회원가입 완료 🎉 (아이디: ${id}, 이름: ${name}, 성별: ${gender})`;

  setTimeout(() => window.close(), 1200);
});