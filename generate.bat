@echo off
setlocal enabledelayedexpansion
set /p gameName="Enter game name: "
set "pattern=.\Games\%gameName%\*.png"

if not exist ".\Games\%gameName%\" (
    echo Directory .\Games\%gameName%\ not found
    exit /b
)

> ".\Games\%gameName%\%gameName%.txt" (
    for %%i in (%pattern%) do (
        echo 'Games/%gameName%/%%~nxi',
    )
)
echo Image names written to .\Games\%gameName%\%gameName%.txt
