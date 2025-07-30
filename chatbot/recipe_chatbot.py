import os
from transformers import T5Tokenizer, T5ForConditionalGeneration

model_name = "flax-community/t5-recipe-generation"
tokenizer_name = "t5-base"
save_dir = "./saved_model"

print("📥 Đang tải tokenizer...")
tokenizer = T5Tokenizer.from_pretrained(tokenizer_name)

print("📥 Đang tải model (Flax → PyTorch)...")
model = T5ForConditionalGeneration.from_pretrained(model_name, from_flax=True)

print(f"💾 Đang lưu model vào: {save_dir}")
model.save_pretrained(save_dir)
tokenizer.save_pretrained(save_dir)
print("✅ Hoàn tất lưu model!")

print("\n👉 Giờ bạn có thể sử dụng model offline từ './saved_model'")
