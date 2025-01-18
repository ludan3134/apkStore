package aes

import (
	"bytes"
	"fmt"
	"testing"
)

func TestAesBase64_Decrypt(t *testing.T) {
	hex := []byte("mrAMRfVmITakEx95")
	ivHex := []byte("NGlcV55daOV36eVy")
	aesBase64 := NewAesBase64(hex, ivHex)
	// 测试用的明文字符串
	plaintext := []byte("2879940cfe3c")

	// 加密
	encrypted, err := aesBase64.Encrypt(plaintext)
	fmt.Println("encrypted", encrypted)
	if err != nil {
		t.Fatalf("Failed to encrypt: %v", err)
	}

	// 解密
	decrypted, err := aesBase64.Decrypt(encrypted)
	if err != nil {
		t.Fatalf("Failed to decrypt: %v", err)
	}
	fmt.Println("decrypted", string(decrypted))

	// 比较解密后的文本与原始文本是否相同
	if !bytes.Equal(plaintext, decrypted) {
		t.Errorf("Decrypted text does not match the original. Got %s, want %s", decrypted, plaintext)
	}

	// 测试空字符串的加密和解密
	emptyText := []byte("")
	encryptedEmpty, err := aesBase64.Encrypt(emptyText)
	if err != nil {
		t.Fatalf("Failed to encrypt empty text: %v", err)
	}
	decryptedEmpty, err := aesBase64.Decrypt(encryptedEmpty)
	if err != nil {
		t.Fatalf("Failed to decrypt empty text: %v", err)
	}
	if !bytes.Equal(emptyText, decryptedEmpty) {
		t.Errorf("Decrypted empty text does not match the original")
	}
}
